import type { FloorGeometry } from './types/floorplan';


export default function FloorPlan({geometry}: {geometry: FloorGeometry}) {
    const { width, height, outline, rooms, corridors, doors, entrances } = geometry
    console.log(entrances)


    const [out_p1, out_p2, out_p3, out_p4] = outline
    const outline_points = `${out_p1.x},${out_p1.y} ${out_p2.x},${out_p2.y} ${out_p3.x},${out_p3.y} ${out_p4.x},${out_p4.y}`
    const outline_polygon = <polygon points={outline_points} fill="none" stroke="black" strokeWidth={0.1}></polygon>

    const corridor_polygons = corridors.map((corridor) => {
        const points_arr = corridor.points
        let points = ``
        points_arr.forEach(point => points += `${point.x},${point.y} `)
        return <polygon points={points} fill="none" stroke="black" strokeWidth={0.1}></polygon>
    })

    const room_polygons = rooms.map((room) => {
        const [p1, p2, p3, p4] = room.room_points
        const points = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
        return <polygon points={points} fill="none" stroke="black" strokeWidth={0.1}></polygon>
    })

    const room_labels = rooms.map((room) => {
        const id_label = room.room_id;
        const label_point = room.room_label;

        return <text x={label_point.x} y={label_point.y} textAnchor="middle" fontSize={0.5}>{id_label}</text>
    }) 

    //Note That door_geometry and entrance_geometry rely on set door orientations Specific to building. An orientation key should be added.
    const door_geometry = doors.map((door) => {
        const door_point = door.position

        return <line x1={door_point.x-0.5}y1={door_point.y}x2={door_point.x+0.5}y2={door_point.y} 
                stroke="blue" strokeWidth={0.2} strokeLinecap='butt'></line>
    })

    const entrance_geometry = entrances.map((entrance) => {
        const entrance_point = entrance.position
        return <line x1={entrance_point.x}y1={entrance_point.y-0.5}x2={entrance_point.x}y2={entrance_point.y+0.5} 
                stroke="#03d030" strokeWidth={0.3} strokeLinecap='butt'></line>
    })

    const entrance_labels = entrances.map((entrance) => {
        const entrance_point = entrance.position
        const entrance_label = entrance.entrance_id.slice(-2)

        if (entrance_point.x === 0) {
                return <text x={entrance_point.x - 0.5} y={entrance_point.y} textAnchor="end" fontSize={0.5}>E_{entrance_label}</text>
        }else {
            return <text x={entrance_point.x + 0.5} y={entrance_point.y} textAnchor="start" fontSize={0.5}>E_{entrance_label}</text>
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
        </svg>
    )
}