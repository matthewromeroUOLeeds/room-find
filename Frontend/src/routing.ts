import type { RoutingGraph } from './graph';

export type Route = {
    //node ids in walking order, including the start and the destination
    nodes: string[],
    //total length in floorplan units
    distance: number,
};

//Shortest path between two nodes (Dijkstra).
//Returns null when the destination cannot be reached from the start.
//Throws if either id is not a node in the graph, since that is a caller bug rather than a routing result.
//The graph is small (one floor), so the unvisited node is found by a linear scan instead of a priority queue.
export function shortestPath(graph: RoutingGraph, from: string, to: string): Route | null {
    if (!graph.nodes.has(from)) throw new Error(`unknown start node: ${from}`)
    if (!graph.nodes.has(to)) throw new Error(`unknown destination node: ${to}`)

    const distance = new Map<string, number>([[from, 0]])
    const previous = new Map<string, string>()
    const unvisited = new Set(graph.nodes.keys())

    while (unvisited.size > 0) {
        //pick the unvisited node with the smallest known distance
        let current: string | undefined
        let current_distance = Infinity
        for (const id of unvisited) {
            const d = distance.get(id) ?? Infinity
            if (d < current_distance) {
                current = id
                current_distance = d
            }
        }

        //nothing reachable is left
        if (current === undefined) return null
        if (current === to) break
        unvisited.delete(current)

        for (const neighbour of graph.adjacency.get(current) ?? []) {
            if (!unvisited.has(neighbour.to)) continue
            const candidate = current_distance + neighbour.weight
            if (candidate < (distance.get(neighbour.to) ?? Infinity)) {
                distance.set(neighbour.to, candidate)
                previous.set(neighbour.to, current)
            }
        }
    }

    const total = distance.get(to)
    if (total === undefined) return null

    //walk back from the destination to rebuild the path
    const nodes = [to]
    let step = to
    while (step !== from) {
        const before = previous.get(step)
        if (before === undefined) return null
        nodes.unshift(before)
        step = before
    }

    return {nodes, distance: total}
}
