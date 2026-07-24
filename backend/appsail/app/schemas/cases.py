from pydantic import BaseModel
from typing import List, Optional

class CaseResponse(BaseModel):
    case_id: str
    crime_number: str
    district: str
    police_station: str
    crime_head: str
    status: str
    date: str
    description: Optional[str] = None

class HotspotData(BaseModel):
    latitude: float
    longitude: float
    crime_count: int
    severity: str

class HotspotResponse(BaseModel):
    hotspots: List[HotspotData]
