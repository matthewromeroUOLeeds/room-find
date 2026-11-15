import { useState } from 'react'
import './App.css'
import FloorPlan from './FloorPlan'
import NavigationOverlay from './NavigationOverlay'
import { buildGraph } from './graph'

import floorPlan_data from "../../Data/Buildings/Example_Building/floorplan.json" with {type: 'json'};
import navigation_data from "../../Data/Buildings/Example_Building/navigation.json" with {type: 'json'};
import type { FloorGeometry, NavigationGraph } from '../../Data/src/types';

const floor_plan = floorPlan_data as FloorGeometry
const routing_graph = buildGraph(navigation_data as NavigationGraph)

function App() {
  const [showGraph, setShowGraph] = useState(false)

  return (
    <>
      <header>
        <h1>Room Find</h1>
      </header>

      <main>
        <label>
          <input type="checkbox" checked={showGraph} onChange={(e) => setShowGraph(e.target.checked)} />
          {' '}Show navigation graph
        </label>
        <FloorPlan geometry={floor_plan}>
          {showGraph && <NavigationOverlay graph={routing_graph} />}
        </FloorPlan>
      </main>
    </>
  )
}

export default App
