import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


with open("../../Data/Buildings/Test_Building/building.json", "r") as infile:
    test_building_data = json.load(infile)

with open("../../Data/Buildings/Example_Building/building.json", "r") as infile:
    example_building_data = json.load(infile)


buildings_data = [test_building_data, example_building_data]

@app.get("/buildings")
def send_buildings():
    return buildings_data

