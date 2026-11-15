import { useState } from 'react'
import './App.css'
import FloorPlan from './FloorPlan'
import NavigationOverlay from './NavigationOverlay'
import RouteOverlay from './RouteOverlay'
import { buildGraph } from './graph'
import { shortestPath } from './routing'
import { describeRoute } from './describeRoute'

import floorPlan_data from "../../Data/Buildings/Example_Building/floorplan.json" with {type: 'json'};
import navigation_data from "../../Data/Buildings/Example_Building/navigation.json" with {type: 'json'};
import type { FloorGeometry, NavigationGraph } from '../../Data/src/types';

const floor_plan = floorPlan_data as FloorGeometry
const routing_graph = buildGraph(navigation_data as NavigationGraph)

const entrance_nodes = [...routing_graph.nodes.values()].filter(node => node.type === 'entrance')
const room_nodes = [...routing_graph.nodes.values()].filter(node => node.type === 'door')

function App() {
  const [showGraph, setShowGraph] = useState(false)
  const [fromId, setFromId] = useState(entrance_nodes[0]?.id ?? '')
  const [toId, setToId] = useState('')

  const route = fromId && toId ? shortestPath(routing_graph, fromId, toId) : null
  const destinationRoom = routing_graph.nodes.get(toId)?.room_id
  const summary = route ? describeRoute(routing_graph, route) : 'Choose a room to see a route.'

  return (
    <>
      <header>
        <h1>Room Find</h1>
      </header>

      <main>
        <section className="controls" aria-label="Route finder">
          <label>
            From
            <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {entrance_nodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
            </select>
          </label>
          <label>
            To
            <select value={toId} onChange={(e) => setToId(e.target.value)}>
              <option value="">Choose a room</option>
              {room_nodes.map(node => <option key={node.id} value={node.id}>{node.room_id}</option>)}
            </select>
          </label>
        </section>

        {/* role="status" is a polite live region, so screen readers announce the route when it changes */}
        <p className="route-summary" role="status">{summary}</p>

        <label className="toggle">
          <input type="checkbox" checked={showGraph} onChange={(e) => setShowGraph(e.target.checked)} />
          Show navigation graph
        </label>

        <div className="floorplan">
          <FloorPlan geometry={floor_plan} highlightRoomId={destinationRoom}>
            {showGraph && <NavigationOverlay graph={routing_graph} />}
            {route && <RouteOverlay graph={routing_graph} route={route} />}
          </FloorPlan>
        </div>
      </main>
    </>
  )
}

export default App
