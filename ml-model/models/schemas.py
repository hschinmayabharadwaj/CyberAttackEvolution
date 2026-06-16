from dataclasses import dataclass


@dataclass
class TimeSeriesPoint:
    date: str
    category: str
    frequency: int
    severity_avg: float


@dataclass
class PredictionResult:
    category: str
    current_value: float
    predicted_value: float
    change_pct: float
    confidence: float
    trend: str  # "rising", "stable", "declining"
    risk_level: str  # "critical", "high", "medium", "low"
    forecast_horizon: str
    model_type: str


@dataclass
class EvolutionEvent:
    timestamp: str
    parent_pattern: str
    child_pattern: str
    mutation_type: str  # "variant", "evolution", "convergence", "divergence"
    confidence: float
    description: str
