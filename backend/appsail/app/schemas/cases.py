from pydantic import BaseModel
from typing import List, Optional, Any

class AccusedData(BaseModel):
    accused_id: str
    name: str
    age: str
    person_id: str

class CaseResponse(BaseModel):
    case_id: str
    crime_number: str
    district: str
    police_station: str
    crime_head: str
    status: str
    date: str
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: Optional[str] = "low"
    accused: List[AccusedData] = []
    victims: List[Any] = []

class HotspotData(BaseModel):
    latitude: float
    longitude: float
    crime_count: int
    severity: str

class HotspotResponse(BaseModel):
    hotspots: List[HotspotData]
