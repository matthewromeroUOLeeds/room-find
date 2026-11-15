import type { RoutingGraph } from './graph';
import type { Route } from './routing';

//A name a person would recognise: the room for a door node, otherwise the node id.
function nodeName(graph: RoutingGraph, id: string): string {
    return graph.nodes.get(id)?.room_id ?? id
}

//Plain-text summary of a route, for screen readers and as a visible caption.
export function describeRoute(graph: RoutingGraph, route: Route): string {
    const start = nodeName(graph, route.nodes[0] ?? '')
    const end = nodeName(graph, route.nodes.at(-1) ?? '')

    if (route.nodes.length <= 1) return `You are already at ${start}.`
    return `Route from ${start} to ${end}: ${route.distance.toFixed(1)} units.`
}
