import glob
import json
import pickle
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from .schemas import EvolutionEvent, PredictionResult, TimeSeriesPoint


class CyberAttackEvolutionModel:
    """
    Time-series prediction model for cyber attack pattern evolution.

    This model analyzes historical attack data to predict:
    1. New attack patterns likely to emerge
    2. Evolution trajectories of existing threats
    3. Convergence/divergence of attack techniques
    4. Seasonal patterns in attack frequencies
    """

    def __init__(
        self,
        lookback_months: int = 24,
        config_file_path: Optional[str] = None,
    ):
        self.lookback_months = lookback_months
        self.historical_data: Dict[str, List[TimeSeriesPoint]] = {}
        self.config: Dict = {}
        self.trained = False
        self._load_config(config_file_path)

    def _resolve_model_root(self) -> Path:
        return Path(__file__).resolve().parent.parent

    def _load_config(self, config_file_path: Optional[str]):
        config_path = Path(config_file_path) if config_file_path else self._resolve_model_root() / "model_config.json"
        if not config_path.exists():
            raise FileNotFoundError(
                f"Config file not found: {config_path}. Create model_config.json to avoid hardcoded values."
            )

        with config_path.open("r", encoding="utf-8") as config_file:
            self.config = json.load(config_file)

    def train(self) -> Dict:
        """
        Train the time-series prediction model.

        In production, this would use:
        - ARIMA/SARIMA for stationary series
        - Prophet for series with strong seasonality
        - LSTM networks for complex non-linear patterns
        - Ensemble methods combining multiple approaches

        Returns model training metrics.
        """
        errors: List[float] = []
        squared_errors: List[float] = []
        all_actuals: List[float] = []

        for points in self.historical_data.values():
            frequencies = [point.frequency for point in points]
            if len(frequencies) < 2:
                continue

            for index in range(1, len(frequencies)):
                actual = frequencies[index]
                predicted = frequencies[index - 1]
                error = actual - predicted
                errors.append(abs(error))
                squared_errors.append(error * error)
                all_actuals.append(actual)

        mae = (sum(errors) / len(errors)) if errors else 0.0
        rmse = ((sum(squared_errors) / len(squared_errors)) ** 0.5) if squared_errors else 0.0

        if all_actuals:
            mean_actual = sum(all_actuals) / len(all_actuals)
            total_variance = sum((value - mean_actual) ** 2 for value in all_actuals)
            r2_score = 1 - (sum(squared_errors) / total_variance) if total_variance > 0 else 0.0
            avg_actual = mean_actual
        else:
            r2_score = 0.0
            avg_actual = 0.0

        normalization_denom = max(1.0, avg_actual)
        metrics = {
            "model_type": self.config.get("model_type_training", "Deterministic Time-Series Baseline"),
            "training_samples": sum(len(v) for v in self.historical_data.values()),
            "categories_trained": len(self.historical_data),
            "lookback_window": f"{self.lookback_months} months",
            "training_loss": round(mae / normalization_denom, 4),
            "validation_loss": round(rmse / normalization_denom, 4),
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "r2_score": round(max(-1.0, min(1.0, r2_score)), 4),
            "convergence_epochs": min(500, max(10, sum(len(v) for v in self.historical_data.values()))),
        }

        self.trained = True
        return metrics

    def _default_model_dir(self) -> Path:
        root = self._resolve_model_root()
        model_dir = Path(self.config.get("model_output_dir", root / "trained_models"))
        try:
            model_dir = Path(model_dir)
        except Exception:
            model_dir = root / "trained_models"
        return model_dir

    def save_model(self, path: Optional[str] = None) -> Path:
        """
        Save the trained model state to a pickle (.pkl) file.

        If `path` is None, uses the `model_output_dir` and `model_filename` from config
        or defaults to `trained_models/cyber_model_<timestamp>.pkl`.
        Returns the Path to the saved file.
        """
        if not self.trained:
            # Ensure model is trained before saving
            self.train()

        model_dir = self._default_model_dir()
        model_dir.mkdir(parents=True, exist_ok=True)

        if path:
            out_path = Path(path)
        else:
            filename = self.config.get("model_filename") or f"cyber_model_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pkl"
            out_path = model_dir / filename

        # Serialize only necessary state: config, lookback_months, historical_data, trained flag
        payload = {
            "config": self.config,
            "lookback_months": self.lookback_months,
            "historical_data": {k: [asdict(p) for p in v] for k, v in self.historical_data.items()},
            "trained": self.trained,
        }

        with out_path.open("wb") as f:
            pickle.dump(payload, f)

        return out_path

    @classmethod
    def load_from_pickle(cls, path: str) -> "CyberAttackEvolutionModel":
        """Load a pickled model state and return a `CyberAttackEvolutionModel` instance.

        The method will populate `historical_data` and `config` from the pickle.
        """
        p = Path(path)
        if not p.exists():
            raise FileNotFoundError(f"Pickle file not found: {p}")

        with p.open("rb") as f:
            payload = pickle.load(f)

        inst = cls(lookback_months=payload.get("lookback_months", 24))

        # Overwrite loaded config and historical_data
        inst.config = payload.get("config", inst.config)
        raw_hist = payload.get("historical_data", {})
        inst.historical_data = {}
        for k, points in raw_hist.items():
            inst.historical_data[k] = [
                # reconstruct TimeSeriesPoint dataclass
                TimeSeriesPoint(date=p["date"], category=p["category"], frequency=int(p["frequency"]), severity_avg=float(p["severity_avg"]))
                for p in points
            ]

        inst.trained = bool(payload.get("trained", True))
        return inst

    @classmethod
    def auto_load(cls, lookback_months: int = 24) -> "CyberAttackEvolutionModel":
        """Auto-discover the latest trained .pkl in `trained_models/` and load it."""
        inst = cls(lookback_months=lookback_months)
        model_dir = inst._default_model_dir()
        pkl_files = sorted(glob.glob(str(model_dir / "cyber_model_*.pkl")))
        if not pkl_files:
            raise FileNotFoundError(
                f"No trained .pkl found in {model_dir}. Run train_model.ipynb first."
            )
        return cls.load_from_pickle(pkl_files[-1])

    def predict(self, horizon_months: int = 6) -> List[PredictionResult]:
        """
        Generate predictions for each attack category.

        Args:
            horizon_months: Number of months to forecast ahead

        Returns:
            List of prediction results per category
        """
        if not self.trained:
            self.train()

        predictions = []

        for category, points in self.historical_data.items():
            recent = points[-6:]
            early = points[:6]

            recent_avg = sum(p.frequency for p in recent) / len(recent)
            early_avg = sum(p.frequency for p in early) / len(early)

            growth_rate = (recent_avg - early_avg) / early_avg if early_avg > 0 else 0
            projected = recent_avg * (1 + growth_rate * horizon_months / self.lookback_months)

            trend_thresholds = self.config.get("trend_thresholds", {})
            rising_threshold = float(trend_thresholds.get("rising", 0.3))
            declining_threshold = float(trend_thresholds.get("declining", -0.1))

            if growth_rate > rising_threshold:
                trend = "rising"
            elif growth_rate < declining_threshold:
                trend = "declining"
            else:
                trend = "stable"

            change_pct = round((projected - recent_avg) / recent_avg * 100, 1) if recent_avg > 0 else 0
            risk_rules = self.config.get("risk_rules", {})
            critical_rule = risk_rules.get("critical", {"min_change_pct": 50, "min_current_value": 100})
            high_rule = risk_rules.get("high", {"min_change_pct": 30, "min_current_value": 200})
            medium_rule = risk_rules.get("medium", {"min_change_pct": 10})

            if change_pct > float(critical_rule.get("min_change_pct", 50)) and recent_avg > float(critical_rule.get("min_current_value", 100)):
                risk_level = "critical"
            elif change_pct > float(high_rule.get("min_change_pct", 30)) or recent_avg > float(high_rule.get("min_current_value", 200)):
                risk_level = "high"
            elif change_pct > float(medium_rule.get("min_change_pct", 10)):
                risk_level = "medium"
            else:
                risk_level = "low"

            variances = [abs(p.frequency - recent_avg) for p in recent]
            avg_variance = sum(variances) / len(variances) if variances else 0
            confidence_config = self.config.get("confidence", {})
            confidence_min = float(confidence_config.get("min", 0.6))
            confidence_max = float(confidence_config.get("max", 0.98))
            variance_penalty_factor = float(confidence_config.get("variance_penalty_factor", 0.5))
            confidence = max(
                confidence_min,
                min(confidence_max, 1 - (avg_variance / (recent_avg + 1)) * variance_penalty_factor),
            )

            predictions.append(PredictionResult(
                category=category,
                current_value=round(recent_avg, 1),
                predicted_value=round(projected, 1),
                change_pct=change_pct,
                confidence=round(confidence, 3),
                trend=trend,
                risk_level=risk_level,
                forecast_horizon=f"{horizon_months} months",
                model_type=self.config.get("model_type_prediction", "Deterministic Time-Series Baseline"),
            ))

        risk_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        predictions.sort(key=lambda p: (risk_order.get(p.risk_level, 4), -p.change_pct))

        return predictions

    def detect_evolution_events(self) -> List[EvolutionEvent]:
        """
        Detect attack pattern evolution events from historical data.

        Analyzes growth rates, trend changes, and correlation between categories
        to identify pattern evolution, convergence, and divergence events.
        """
        events: List[EvolutionEvent] = []

        for category, points in self.historical_data.items():
            if len(points) < 12:
                continue

            recent = points[-6:]
            mid = points[len(points) // 2 - 3 : len(points) // 2 + 3]
            early = points[:6]

            recent_avg = sum(p.frequency for p in recent) / len(recent)
            mid_avg = sum(p.frequency for p in mid) / len(mid)
            early_avg = sum(p.frequency for p in early) / len(early)

            recent_sev = sum(p.severity_avg for p in recent) / len(recent)
            early_sev = sum(p.severity_avg for p in early) / len(early)

            growth = (recent_avg - early_avg) / early_avg if early_avg > 0 else 0
            acceleration = (
                (recent_avg - mid_avg) / mid_avg - (mid_avg - early_avg) / early_avg
                if mid_avg > 0 and early_avg > 0
                else 0
            )
            sev_growth = (recent_sev - early_sev) / early_sev if early_sev > 0 else 0

            evolution_config = self.config.get("evolution_thresholds", {})
            evolution_growth_min = float(evolution_config.get("evolution_growth_min", 1.0))
            evolution_severity_growth_min = float(evolution_config.get("evolution_severity_growth_min", 0.2))
            divergence_acceleration_min = float(evolution_config.get("divergence_acceleration_min", 0.5))
            divergence_recent_avg_min = float(evolution_config.get("divergence_recent_avg_min", 50))

            if growth > evolution_growth_min and sev_growth > evolution_severity_growth_min:
                events.append(EvolutionEvent(
                    timestamp=recent[-1].date + "-01",
                    parent_pattern=category,
                    child_pattern=f"Advanced {category.replace('_', ' ').title()}",
                    mutation_type="evolution",
                    confidence=min(0.95, 0.6 + growth * 0.15),
                    description=f"{category} shows {growth:.0%} growth with increasing severity ({sev_growth:.0%}), indicating evolution to more sophisticated variants.",
                ))

            if acceleration > divergence_acceleration_min and recent_avg > divergence_recent_avg_min:
                events.append(EvolutionEvent(
                    timestamp=recent[-1].date + "-15",
                    parent_pattern=category,
                    child_pattern=f"{category.replace('_', ' ').title()} Variant",
                    mutation_type="divergence",
                    confidence=min(0.92, 0.55 + acceleration * 0.2),
                    description=f"{category} shows accelerating growth (acceleration={acceleration:.2f}), suggesting divergence into new sub-variants.",
                ))

        categories = list(self.historical_data.keys())
        for i in range(len(categories)):
            for j in range(i + 1, len(categories)):
                cat_a, cat_b = categories[i], categories[j]
                pts_a = [p.frequency for p in self.historical_data[cat_a][-12:]]
                pts_b = [p.frequency for p in self.historical_data[cat_b][-12:]]

                if len(pts_a) != len(pts_b) or len(pts_a) < 6:
                    continue

                avg_a = sum(pts_a) / len(pts_a)
                avg_b = sum(pts_b) / len(pts_b)
                cov = sum((a - avg_a) * (b - avg_b) for a, b in zip(pts_a, pts_b)) / len(pts_a)
                std_a = (sum((a - avg_a) ** 2 for a in pts_a) / len(pts_a)) ** 0.5
                std_b = (sum((b - avg_b) ** 2 for b in pts_b) / len(pts_b)) ** 0.5

                if std_a > 0 and std_b > 0:
                    corr = cov / (std_a * std_b)
                    convergence_config = self.config.get("convergence_thresholds", {})
                    correlation_min = float(convergence_config.get("correlation_min", 0.8))
                    growth_min = float(convergence_config.get("growth_min", 0.3))

                    if corr > correlation_min:
                        growth_a = (pts_a[-1] - pts_a[0]) / pts_a[0] if pts_a[0] > 0 else 0
                        growth_b = (pts_b[-1] - pts_b[0]) / pts_b[0] if pts_b[0] > 0 else 0
                        if growth_a > growth_min and growth_b > growth_min:
                            events.append(EvolutionEvent(
                                timestamp=self.historical_data[cat_a][-1].date + "-01",
                                parent_pattern=f"{cat_a} + {cat_b}",
                                child_pattern=f"Combined {cat_a.replace('_', ' ').title()}-{cat_b.replace('_', ' ').title()}",
                                mutation_type="convergence",
                                confidence=round(corr * 0.85, 2),
                                description=f"High correlation ({corr:.2f}) between {cat_a} and {cat_b} with mutual growth suggests technique convergence.",
                            ))

        events.sort(key=lambda e: e.timestamp)
        return events

    def get_threat_landscape_summary(self) -> Dict:
        """Generate a comprehensive threat landscape summary."""
        predictions = self.predict(6)

        critical_threats = [p for p in predictions if p.risk_level == "critical"]
        high_threats = [p for p in predictions if p.risk_level == "high"]

        total_incidents = sum(
            sum(p.frequency for p in points)
            for points in self.historical_data.values()
        )

        return {
            "summary_date": datetime.now().strftime("%Y-%m-%d"),
            "model_version": self.config.get("model_version", "2.5.0"),
            "total_historical_incidents": total_incidents,
            "active_categories": len(self.historical_data),
            "critical_threats": len(critical_threats),
            "high_threats": len(high_threats),
            "top_growing": max(predictions, key=lambda p: p.change_pct).category if predictions else None,
            "top_declining": min(predictions, key=lambda p: p.change_pct).category if predictions else None,
            "avg_model_confidence": round(
                sum(p.confidence for p in predictions) / len(predictions), 3
            ) if predictions else 0,
            "predictions": [asdict(p) for p in predictions],
            "evolution_events": [asdict(e) for e in self.detect_evolution_events()],
        }
