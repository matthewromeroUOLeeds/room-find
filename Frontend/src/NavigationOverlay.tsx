import type { NavigationNode } from '../../Data/src/types';
import type { RoutingGraph } from './graph';
import { ENTRANCE_COLOUR } from './colours';

const NODE_COLOURS: Record<NavigationNode['type'], string> = {
    entrance: ENTRANCE_COLOUR,
    door: 'blue',
    corridor: '#e8590c',
}

//Debug layer: draws the navigation graph on the floorplan. Render it as a child of <FloorPlan>.
export default function NavigationOverlay({graph}: {graph: RoutingGraph}) {
    const edge_lines = graph.edges.map((edge) => {
        const from = graph.nodes.get(edge.from)
        const to = graph.nodes.get(edge.to)
        if (!from || !to) return null

        return (
            <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="#e8590c" strokeWidth={0.1} strokeDasharray="0.3 0.2">
                <title>{`${edge.from} to ${edge.to}: ${edge.weight.toFixed(2)}`}</title>
            </line>
        )
    })

    const node_dots = [...graph.nodes.values()].map((node) => (
        <circle key={node.id} cx={node.x} cy={node.y} r={0.25} fill={NODE_COLOURS[node.type]}>
            <title>{`${node.id} (${node.x}, ${node.y})`}</title>
        </circle>
    ))

    return (
        <g aria-label="Navigation graph">
            {edge_lines}
            {node_dots}
        </g>
    )
}
