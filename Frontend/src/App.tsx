import './App.css'
import FloorPlan from './FloorPlan'

import RouteOverlay from './RouteOverlay'


import floorPlan_data from "../../Data/Buildings/Test_Building/floorplan.json" with {type: 'json'};
// import navigation_data from "../../Data/Buildings/Test_Building/navigation.json" with {type: 'json'};
// import type { FloorGeometry, NavigationGraph } from '../../Data/src/types';
import type { FloorGeometry } from '../../Data/src/types';

import routePath from "../../Backend/output/route.json"

const floor_plan = floorPlan_data as FloorGeometry


function App() {
  return (
    <>
      <header>
        <h1>Room Find</h1>
      </header>

      <main>
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
