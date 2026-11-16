import type { Point } from '../../Data/src/types'

//Draws a route as one line through its nodes. Render it as a child of <FloorPlan>.
export default function RouteOverlay({route}: {route: Point[ ]}) {
    const points = route.map(({ x, y }) => `${x},${y}`).join(" ");
    return (
        <polyline points={points} fill="none" stroke="#d6336c" strokeWidth={0.25}
            strokeLinecap="round" strokeLinejoin="round" aria-label="Route" />
    )
}
