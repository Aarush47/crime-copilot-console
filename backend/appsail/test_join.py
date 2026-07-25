from app.database.connection import db
import asyncio

async def test():
    try:
        zcql = db.get_zcql()
        query = "SELECT CaseMaster.ROWID FROM CaseMaster LEFT JOIN CrimeHead ON CaseMaster.CrimeMajorHeadID = CrimeHead.CrimeHeadID LIMIT 1"
        res = zcql.execute_query(query)
        print("Success:", res)
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
