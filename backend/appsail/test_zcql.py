from app.database.connection import db
import asyncio

async def test():
    try:
        zcql = db.get_zcql()
        query = "SELECT CaseMaster.ROWID, CaseMaster.CrimeNo, CaseMaster.latitude, CaseMaster.longitude, CaseMaster.BriefFacts, CaseMaster.CrimeRegisteredDate, CaseMaster.CrimeMajorHeadID, CaseMaster.CaseStatusID, CaseMaster.PoliceStationID FROM CaseMaster"
        res = zcql.execute_query(query)
        print("Success:", res)
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
