import type { ReactNode } from 'react';
import type { FloorGeometry, Orientation, Point } from '../../Data/src/types';

//End points of an opening (door or entrance) of the given length, centred on its position.
function openingEnds(point: Point, orientation: Orientation, length = 1) {
    const half = length / 2
    return orientation === 'horizontal'
        ? {x1: point.x - half, y1: point.y, x2: point.x + half, y2: point.y}
        : {x1: point.x, y1: point.y - half, x2: point.x, y2: point.y + half}
}

//children are drawn on top of the floorplan, in floorplan coordinates (e.g. a navigation overlay)
export default function FloorPlan({geometry, children}: {geometry: FloorGeometry, children?: ReactNode}) {
    const { width, height, outline, rooms, corridors, doors, entrances } = geometry


    const [out_p1, out_p2, out_p3, out_p4] = outline
    const outline_points = `${out_p1.x},${out_p1.y} ${out_p2.x},${out_p2.y} ${out_p3.x},${out_p3.y} ${out_p4.x},${out_p4.y}`
    const outline_polygon = <polygon points={outline_points} fill="none" stroke="black" strokeWidth={0.1}></polygon>

    const corridor_polygons = corridors.map((corridor) => {
        const points_arr = corridor.points
        let points = ``
        points_arr.forEach(point => points += `${point.x},${point.y} `)
        return <polygon key={corridor.id} points={points} fill="none" stroke="black" strokeWidth={0.1}></polygon>
    })

    const room_polygons = rooms.map((room) => {
        const [p1, p2, p3, p4] = room.room_points
        const points = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
        return <polygon key={room.room_id} points={points} fill="none" stroke="black" strokeWidth={0.1}></polygon>
    })

    const room_labels = rooms.map((room) => {
        const id_label = room.room_id;
        const label_point = room.room_label;

        return <text key={room.room_id} x={label_point.x} y={label_point.y} textAnchor="middle" fontSize={0.5}>{id_label}</text>
    })

    const door_geometry = doors.map((door) => {
        return <line key={door.room_id} {...openingEnds(door.position, door.orientation)}
                stroke="blue" strokeWidth={0.2} strokeLinecap='butt'></line>
    })

    const entrance_geometry = entrances.map((entrance) => {
        return <line key={entrance.entrance_id} {...openingEnds(entrance.position, entrance.orientation)}
                stroke="#03d030" strokeWidth={0.3} strokeLinecap='butt'></line>
    })

    const entrance_labels = entrances.map((entrance) => {
        const entrance_point = entrance.position
        const entrance_label = entrance.entrance_id.slice(-2)

        if (entrance_point.x === 0) {
                return <text key={entrance.entrance_id} x={entrance_point.x - 0.5} y={entrance_point.y} textAnchor="end" fontSize={0.5}>E_{entrance_label}</text>
        }else {
            return <text key={entrance.entrance_id} x={entrance_point.x + 0.5} y={entrance_point.y} textAnchor="start" fontSize={0.5}>E_{entrance_label}</text>
        }
    })

    

    return (
        <svg viewBox={`-2 -1 ${width + 8} ${height + 2}`}>
            {outline_polygon}
            {corridor_polygons}
            {room_polygons}
            {room_labels}
            {door_geometry}
            {entrance_geometry}
            {entrance_labels}
            {children}
        </svg>
    )
}