from app.database.connection import db
import asyncio

async def test():
    try:
        datastore = db.get_datastore()
        table = datastore.table("Unit")
        cols = table.get_all_columns()
        for c in cols:
            print(c.get("column_name"), c.get("data_type"))
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
