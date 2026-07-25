import json
import csv
import requests

def upload(table_name, file_name):
    with open(file_name, 'r') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
    payload = {
        "table_name": table_name,
        "rows": rows
    }
    
    res = requests.post(
        "https://crime-copilot-50044254740.development.catalystappsail.in/api/upload/chunk",
        json=payload
    )
    
    print(f"{table_name} response: {res.text}")

upload("CrimeHead", "CrimeHead.csv")
upload("Unit", "Unit.csv")
upload("CaseMaster", "CaseMaster.csv")
