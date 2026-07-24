from app.schemas.cases import CaseResponse, HotspotResponse, HotspotData
from typing import List
from app.utils.logger import logger

class CaseService:
    @staticmethod
    async def get_all_cases() -> List[CaseResponse]:
        logger.info("Fetching all cases")
        
        try:
            from app.database.repositories.case_repository import CaseRepository
            db_cases = await CaseRepository.get_all_cases()
            
            logger.info(f"Got {len(db_cases)} cases from DB")
            
            result = []
            for c in db_cases:
                try:
                    # fir_no may be int or string depending on the column type
                    fir_no = c.get("fir_no", "")
                    result.append(CaseResponse(
                        case_id=str(c.get("ROWID", "")),
                        crime_number=str(fir_no),
                        district=str(c.get("district", "")),
                        police_station=str(c.get("ps_jurisdiction", "")),
                        crime_head=str(c.get("crime_type", "")),
                        status=str(c.get("status", "")),
                        date=str(c.get("registered_at", "")),
                        description=str(c.get("brief_facts", "")),
                        latitude=float(c.get("latitude") or 12.9716),
                        longitude=float(c.get("longitude") or 77.5946),
                        severity=str(c.get("severity", "low"))
                    ))
                except Exception as row_err:
                    logger.error(f"Error mapping case row: {row_err} | row={c}")
                    continue
                    
            return result
        except Exception as e:
            logger.error(f"CaseService.get_all_cases failed: {e}")
            return []

    @staticmethod
    async def get_case_by_id(case_id: str) -> CaseResponse | None:
        logger.info(f"Fetching case {case_id}")
        try:
            from app.database.repositories.case_repository import CaseRepository
            c = await CaseRepository.get_case_by_id(case_id)
            if not c:
                return None
                
            return CaseResponse(
                case_id=str(c.get("ROWID", "")),
                crime_number=str(c.get("fir_no", "")),
                district=str(c.get("district", "")),
                police_station=str(c.get("ps_jurisdiction", "")),
                crime_head=str(c.get("crime_type", "")),
                status=str(c.get("status", "")),
                date=str(c.get("registered_at", "")),
                description=str(c.get("brief_facts", "")),
                latitude=float(c.get("latitude") or 12.9716),
                longitude=float(c.get("longitude") or 77.5946),
                severity=str(c.get("severity", "low")),
                accused=c.get("accused", []),
                victims=[]
            )
        except Exception as e:
            logger.error(f"CaseService.get_case_by_id failed: {e}")
            return None

    @staticmethod
    async def get_hotspots() -> HotspotResponse:
        logger.info("Fetching hotspots")
        try:
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
                        severity=str(h.get("severity", "low"))
                    ))
            return HotspotResponse(hotspots=hotspots)
        except Exception as e:
            logger.error(f"CaseService.get_hotspots failed: {e}")
            return HotspotResponse(hotspots=[])
