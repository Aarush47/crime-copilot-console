from pydantic import BaseModel
from typing import List, Dict

class Alert(BaseModel):
    id: int
    message: str
    severity: str

class Hotspot(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    severity: str

class OfficerStats(BaseModel):
    name: str
    cases_resolved: int
    cases_pending: int

class DashboardResponse(BaseModel):
    active_investigations: int
    critical_cases: int
    todays_fir: int
    pending_chargesheets: int
    crime_distribution: Dict[str, int]
    recent_alerts: List[Alert]
    hotspots: List[Hotspot]
    officer_statistics: List[OfficerStats]
