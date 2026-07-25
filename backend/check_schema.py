import os
import sys

# Add appsail directory to path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'appsail'))

from app.database.connection import db
import zcatalyst_sdk

def check_schema():
    print("Initializing Catalyst...")
    try:
        # We need a proper app initialization for zcatalyst_sdk
        app = zcatalyst_sdk.initialize()
        datastore = app.datastore()
        
        # Try both 'accused' and 'Accused'
        for tbl in ['accused', 'Accused']:
            try:
                print(f"\nChecking table: {tbl}")
                meta = datastore.table_meta(tbl)
                columns = meta.column_details
                for col in columns:
                    print(f"Column: {col.column_name}, Type: {col.data_type}, MaxLength: {col.max_length}, IsMandatory: {col.is_mandatory}, IsUnique: {col.is_unique}")
            except Exception as e:
                print(f"Error checking table {tbl}: {e}")
                
        # Try to execute a test insert and catch the error to satisfy #2
        try:
            print("\nAttempting test insert into 'Accused'...")
            table = datastore.table('Accused')
            # Based on upload.py format
            res = table.insert_rows([{
                "accused_master_id": "99999",
                "case_master_id": "99999",
                "accused_name": "Test Name",
                "age_year": "30",
                "person_id": "T1",
            }])
            print(f"Insert successful: {res}")
        except Exception as e:
            print(f"Insert FULL ERROR returned by Catalyst: {e}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_schema()
