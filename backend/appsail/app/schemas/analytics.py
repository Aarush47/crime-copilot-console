from pydantic import BaseModel
from typing import List, Dict

class TrendPoint(BaseModel):
    month: str
    count: int

class AnalyticsResponse(BaseModel):
    crime_trend: List[TrendPoint]
    monthly_fir: int
    district_wise_crime: Dict[str, int]
    crime_head_distribution: Dict[str, int]
    officer_performance: Dict[str, float]
