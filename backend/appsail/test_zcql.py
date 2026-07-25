from app.database.connection import db
import asyncio

async def test():
    try:
        datastore = db.get_datastore()
        table = datastore.table("CaseMaster")
        print(dir(table))
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
