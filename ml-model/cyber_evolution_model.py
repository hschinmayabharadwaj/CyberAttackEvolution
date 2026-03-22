"""
Cyber Attack Pattern Evolution Model - Python ML Backend
=========================================================
Time-series prediction model for cyber attack pattern evolution.
Uses ARIMA/Prophet-style analysis on historical attack data.
"""

import json
from models import (
    AttackCategory,
    CyberAttackEvolutionModel,
    EvolutionEvent,
    PredictionResult,
    TimeSeriesPoint,
)

__all__ = [
    "AttackCategory",
    "TimeSeriesPoint",
    "PredictionResult",
    "EvolutionEvent",
    "CyberAttackEvolutionModel",
]


def main():
    """Run the model and output results."""
    print("=" * 70)
    print("  CYBER ATTACK PATTERN EVOLUTION MODEL")
    print("  Time-Series Prediction Engine")
    print("=" * 70)
    print()

    # Initialize model (expects original historical data file)
    try:
        model = CyberAttackEvolutionModel(lookback_months=24)
    except (FileNotFoundError, ValueError) as error:
        print(f"✗ Initialization failed: {error}")
        print("  Provide original data in historical_attack_data.json")
        print("  Use historical_attack_data.template.json as the schema reference")
        return

    print(f"✓ Historical data loaded: {sum(len(v) for v in model.historical_data.values())} data points")
    print(f"  Categories: {len(model.historical_data)}")
    print()

    # Train
    print("Training model...")
    metrics = model.train()
    print(f"✓ Model trained successfully")
    print(f"  Type: {metrics['model_type']}")
    print(f"  R² Score: {metrics['r2_score']}")
    print(f"  MAE: {metrics['mae']}")
    print(f"  RMSE: {metrics['rmse']}")
    print()

    # Predictions
    print("Generating 6-month predictions...")
    predictions = model.predict(horizon_months=6)
    print()
    print(f"{'Category':<20} {'Current':>10} {'Predicted':>10} {'Change':>8} {'Risk':>10} {'Conf':>6}")
    print("-" * 70)
    for p in predictions:
        print(f"{p.category:<20} {p.current_value:>10.1f} {p.predicted_value:>10.1f} {p.change_pct:>+7.1f}% {p.risk_level:>10} {p.confidence:>5.1%}")

    print()

    # Evolution Events
    print("Detected Evolution Events:")
    print("-" * 70)
    events = model.detect_evolution_events()
    for e in events:
        print(f"  [{e.timestamp}] {e.parent_pattern} → {e.child_pattern}")
        print(f"    Type: {e.mutation_type} | Confidence: {e.confidence:.0%}")
        print()

    # Summary
    summary = model.get_threat_landscape_summary()
    print("=" * 70)
    print(f"  THREAT LANDSCAPE SUMMARY")
    print(f"  Critical Threats: {summary['critical_threats']}")
    print(f"  High Threats: {summary['high_threats']}")
    print(f"  Top Growing: {summary['top_growing']}")
    print(f"  Avg Confidence: {summary['avg_model_confidence']:.1%}")
    print("=" * 70)

    # Export
    with open("threat_analysis_output.json", "w") as f:
        json.dump(summary, f, indent=2)
    print("\n✓ Full analysis exported to threat_analysis_output.json")


if __name__ == "__main__":
    main()
