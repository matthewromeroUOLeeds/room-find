import './App.css'
import FloorPlan from './FloorPlan'

import floorPlan_data from "../../Data/Buildings/Example_Building/floorplan.json" with {type: 'json'};
import type { FloorGeometry } from './types/floorplan';

const floor_plan: FloorGeometry = floorPlan_data 



function App() {


  return (
    <>
      <header>
        <h1>Room Find</h1>
      </header>

      <main>
        <FloorPlan geometry={floor_plan}/>
      </main>
    </>
  )
}

export default App
