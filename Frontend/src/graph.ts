import type { NavigationGraph, NavigationNode } from '../../Data/src/types';

export type WeightedEdge = { from: string, to: string, weight: number };

export type RoutingGraph = {
    nodes: Map<string, NavigationNode>,
    edges: WeightedEdge[],
};

//Straight-line distance in floorplan units. Edges are straight segments, so this is the walking distance.
function distance(a: NavigationNode, b: NavigationNode): number {
    return Math.hypot(a.x - b.x, a.y - b.y)
}

//Index the nodes by id and compute each edge's weight from the node coordinates.
//Throws if an edge refers to a node that does not exist, so a bad navigation.json fails at load time.
export function buildGraph(graph: NavigationGraph): RoutingGraph {
    const nodes = new Map(graph.nodes.map(node => [node.id, node]))

    const edges = graph.edges.map((edge): WeightedEdge => {
        const from = nodes.get(edge.from)
        const to = nodes.get(edge.to)
        if (!from || !to) {
            throw new Error(`navigation edge ${edge.from} -> ${edge.to} refers to an unknown node`)
        }
        return {from: edge.from, to: edge.to, weight: distance(from, to)}
    })

    return {nodes, edges}
}
