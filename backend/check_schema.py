import os
import zcatalyst_sdk
import asyncio

async def main():
    try:
        app = zcatalyst_sdk.initialize()
        zcql = app.zcql()
        print("Checking tables in Catalyst Data Store...")
        
        tables_to_check = [
            "CaseMaster", "ComplainantDetails", "ActSectionAssociation", 
            "Victim", "Accused", "ArrestSurrender", "Act", "Section", 
            "CrimeHeadActSection", "CrimeHead", "CrimeSubHead", "CasteMaster",
            "ReligionMaster", "OccupationMaster", "CaseStatusMaster", "Court",
            "District", "State", "Unit", "UnitType", "Hierarchy", "Rank",
            "Designation", "Employee", "CaseCategory", "GravityOffence",
            "ChargesheetDetails", "cases", "accused", "audit_logs"
        ]
        
        for table in tables_to_check:
            try:
                res = zcql.execute_query(f"SELECT ROWID FROM {table} LIMIT 1")
                print(f"[OK] Table '{table}' exists.")
            except Exception as e:
                err_msg = str(e)
                if "doesn't exist" in err_msg.lower() or "not found" in err_msg.lower():
                    print(f"[MISSING] Table '{table}' does not exist.")
                else:
                    print(f"[ERROR] Table '{table}': {err_msg}")
                
    except Exception as e:
        print(f"Error initializing Catalyst SDK: {e}")

if __name__ == "__main__":
    asyncio.run(main())
