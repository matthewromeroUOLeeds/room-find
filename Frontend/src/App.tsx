import './App.css'
import FloorPlan from './FloorPlan'
import RouteOverlay from './RouteOverlay'
import floorPlan_data from "../../Data/Buildings/Test_Building/floorplan.json" with {type: 'json'};
// import navigation_data from "../../Data/Buildings/Test_Building/navigation.json" with {type: 'json'};
// import type { FloorGeometry, NavigationGraph } from '../../Data/src/types';
import type { Building, FloorGeometry } from '../../Data/src/types';
import routePath from "../../Backend/output/route.json"
import {useState, useEffect, use} from 'react';



const floor_plan = floorPlan_data as FloorGeometry;


function App() {

  const [buildings, setBuidlings] = useState<Building[]>([]);
  const [currBuildingId, setCurrBuildingId] = useState("");
  const [chosenEntrance, setChosenEntrance] = useState("");
  const [chosenRoom, setChosenRoom] = useState("");
  

  useEffect(() => {
    async function getBuildingsInfo() {
      const response = await fetch("http://127.0.0.1:8000/buildings")

      if (!response.ok) {
        throw new Error("Failed To Load Buildings")
      }

      const buildingsInfo = await response.json()
      setBuidlings(buildingsInfo)
  
    }

    getBuildingsInfo().catch(console.error)

  }, [])

const selectedBuilding = buildings.find((building) => building.id === currBuildingId)
const selectedBuildingRooms = selectedBuilding?.rooms ?? []
const selectedBuildingEntrances = selectedBuilding?.entrances ?? []

const buildingNameOptions = buildings.map(number => {
  return <option key={number.id} value={number.id}>{number.name}</option>
})
const buildingRoomOptions = selectedBuildingRooms.map(room => {
  return <option key={room.id} value={room.id}>{room.name}</option>
})

const buildingEntranceOptions = selectedBuildingEntrances.map(entrance => {
  return <option key={entrance.id} value={entrance.id}>{entrance.name}</option>
})

async function postRouteData() {
  console.log([currBuildingId, chosenEntrance, chosenRoom])
}

  return (
    <>
      <header>
        <h1>Room Find</h1>
      </header>

      <main>
        <label>Building</label>
        <select value={currBuildingId} onChange={(event) => setCurrBuildingId(event.target.value)}>
          <option value="">Choose A Building</option>
          {buildingNameOptions}
        </select>

        <label>Room</label>
        <select onChange={(event) => setChosenRoom(event.target.value)}>
          <option value="">rooms</option>
          {buildingRoomOptions}
        </select>

        <label>Entrance</label>
        <select onChange={(event) => setChosenEntrance(event.target.value)}>
          <option value="">entrances</option>
          {buildingEntranceOptions}
        </select>

        <button onClick={postRouteData}>Generate Path</button>

        <div className="floorplan">
          <FloorPlan geometry={floor_plan}>
            <RouteOverlay route={routePath} />
          </FloorPlan>
        </div>
      </main>
    </>
  )
}

export default App
