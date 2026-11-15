import { useState } from 'react'
import './App.css'
import FloorPlan from './FloorPlan'
import NavigationOverlay from './NavigationOverlay'
import RouteOverlay from './RouteOverlay'
import { buildGraph } from './graph'
import { shortestPath } from './routing'

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

  return (
    <>
      <header>
        <h1>Room Find</h1>
      </header>

      <main>
        <div>
          <label>
            From{' '}
            <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {entrance_nodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
            </select>
          </label>
          {' '}
          <label>
            To{' '}
            <select value={toId} onChange={(e) => setToId(e.target.value)}>
              <option value="">Choose a room</option>
              {room_nodes.map(node => <option key={node.id} value={node.id}>{node.room_id}</option>)}
            </select>
          </label>
          {route && <span> {route.distance.toFixed(1)} units</span>}
        </div>
        <label>
          <input type="checkbox" checked={showGraph} onChange={(e) => setShowGraph(e.target.checked)} />
          {' '}Show navigation graph
        </label>
        <FloorPlan geometry={floor_plan}>
          {showGraph && <NavigationOverlay graph={routing_graph} />}
          {route && <RouteOverlay graph={routing_graph} route={route} />}
        </FloorPlan>
      </main>
    </>
  )
}

export default App
