import csv
import random

# Create CrimeHead.csv
crime_heads = [
    (101, "Theft_101", True),
    (102, "Assault_102", True),
    (103, "Burglary_103", True),
    (104, "Fraud_104", True),
    (105, "Cybercrime_105", True),
    (106, "Vandalism_106", True),
    (107, "Robbery_107", True),
    (108, "Kidnapping_108", True),
    (109, "Extortion_109", True),
    (110, "DrugOffense_110", True)
]

with open('CrimeHead.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["CrimeHeadID", "CrimeGroupName", "Active"])
    for ch in crime_heads:
        writer.writerow(ch)

# Create Unit.csv (Police Stations)
# Schema: UnitID, UnitName, TypeID (unique), ParentUnit (unique), NationalityID (mandatory), StateID (mandatory), DistrictID, Active
units = []
for i in range(1, 21):
    uid = random.randint(200000, 299999) + i
    units.append((
        uid,                     # UnitID
        f"Police Station {uid}", # UnitName
        uid,                     # TypeID (unique)
        uid,                     # ParentUnit (unique)
        1,                       # NationalityID
        1,                       # StateID
        1,                       # DistrictID
        True                     # Active
    ))

with open('Unit.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["UnitID", "UnitName", "TypeID", "ParentUnit", "NationalityID", "StateID", "DistrictID", "Active"])
    for u in units:
        writer.writerow(u)
