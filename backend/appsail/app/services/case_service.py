from app.schemas.cases import CaseResponse, HotspotResponse, HotspotData
from typing import List
from app.utils.logger import logger

class CaseService:
    @staticmethod
    async def get_all_cases() -> List[CaseResponse]:
        logger.info("Fetching all cases")
        
        # Try to fetch from Catalyst Data Store
        from app.database.repositories.case_repository import CaseRepository
        db_cases = await CaseRepository.get_all_cases()
        
        if db_cases:
            # Map Catalyst DB records to Pydantic CaseResponse
            return [
                CaseResponse(
                    case_id=str(c.get("ROWID", "")),
                    crime_number=c.get("fir_no", ""),
                    district=c.get("district", ""),
                    police_station=c.get("ps_jurisdiction", ""),
                    crime_head=c.get("crime_type", ""),
                    status=c.get("status", ""),
                    date=c.get("registered_at", ""),
                    description=c.get("brief_facts", ""),
                    latitude=float(c.get("latitude") or 0.0) if c.get("latitude") is not None else None,
                    longitude=float(c.get("longitude") or 0.0) if c.get("longitude") is not None else None,
                    severity=c.get("severity", "low")
                ) for c in db_cases
            ]
        
        return []

    @staticmethod
    async def get_case_by_id(case_id: str) -> CaseResponse | None:
        logger.info(f"Fetching case {case_id}")
        from app.database.repositories.case_repository import CaseRepository
        c = await CaseRepository.get_case_by_id(case_id)
        if not c:
            return None
            
        return CaseResponse(
            case_id=str(c.get("ROWID", "")),
            crime_number=c.get("fir_no", ""),
            district=c.get("district", ""),
            police_station=c.get("ps_jurisdiction", ""),
            crime_head=c.get("crime_type", ""),
            status=c.get("status", ""),
            date=c.get("registered_at", ""),
            description=c.get("brief_facts", ""),
            latitude=float(c.get("latitude") or 0.0) if c.get("latitude") is not None else None,
            longitude=float(c.get("longitude") or 0.0) if c.get("longitude") is not None else None,
            severity=c.get("severity", "low")
        )

    @staticmethod
    async def get_hotspots() -> HotspotResponse:
        logger.info("Fetching hotspots")
        from app.database.repositories.case_repository import CaseRepository
        db_hotspots = await CaseRepository.get_hotspots()
        
        hotspots = []
        for h in db_hotspots:
            lat = h.get("latitude")
            lng = h.get("longitude")
            if lat is not None and lng is not None:
                hotspots.append(HotspotData(
                    latitude=float(lat),
                    longitude=float(lng),
                    crime_count=int(h.get("crime_count") or 1),
                    severity=h.get("severity", "low")
                ))
        return HotspotResponse(hotspots=hotspots)
