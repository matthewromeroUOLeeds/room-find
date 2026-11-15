import type { RoutingGraph } from './graph';
import type { Route } from './routing';

//Draws a route as one line through its nodes. Render it as a child of <FloorPlan>.
export default function RouteOverlay({graph, route}: {graph: RoutingGraph, route: Route}) {
    const points = route.nodes
        .map(id => graph.nodes.get(id))
        .filter(node => node !== undefined)
        .map(node => `${node.x},${node.y}`)
        .join(' ')

    return (
        <polyline points={points} fill="none" stroke="#d6336c" strokeWidth={0.25}
            strokeLinecap="round" strokeLinejoin="round" aria-label="Route" />
    )
}
