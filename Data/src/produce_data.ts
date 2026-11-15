import type { Point, RoomGeometry, EntranceGeometry, DoorGeometry, FloorGeometry, NavigationGraph, NavigationNode, NavigationEdge } from './types.js';

import building_data from '../Buildings/Example_Building/building.json' with { type: 'json' };
let initial_x = 0;
let initial_y = 0;
let room_index=0;
const rooms: RoomGeometry[] = building_data.rooms.map((room) => {
    const roomId = room.id

    if (room_index === 5){
        initial_y = 9
        initial_x = 0
    }
    let room_corners: Point[] = [];
    room_corners.push({x: initial_x, y: initial_y});
    room_corners.push({x: initial_x, y: initial_y+6});
    room_corners.push({x: initial_x+6, y: initial_y+6});
    room_corners.push({x: initial_x+6, y: initial_y});

    const room_label: Point = {x: initial_x + 3, y: initial_y+3}

    initial_x += 6;
    room_index += 1

    const currRoom : RoomGeometry = {room_id: roomId, room_points: room_corners, room_label: room_label}
    return currRoom
})
console.log(rooms)

const entrances: EntranceGeometry[] = [];
if (building_data.entrances[0]) {
    entrances.push({entrance_id: building_data.entrances[0].id, position: {x:0 ,y:7.5}, orientation: 'vertical'})
}
if (building_data.entrances[1]) {
    entrances.push({entrance_id: building_data.entrances[1].id, position: {x:30 ,y:7.5}, orientation: 'vertical'})
}

// Doors sit in the room walls that face the corridor (y=6 above it, y=9 below it).
const doors: DoorGeometry[] = [];
doors.push({room_id: "room_01", position: {x: 3, y:6}, orientation: 'horizontal'})
doors.push({room_id: "room_02", position: {x: 9, y:6}, orientation: 'horizontal'})
doors.push({room_id: "room_03", position: {x: 15, y:6}, orientation: 'horizontal'})
doors.push({room_id: "room_04", position: {x: 21, y:6}, orientation: 'horizontal'})
doors.push({room_id: "room_05", position: {x: 27, y:6}, orientation: 'horizontal'})
doors.push({room_id: "room_06", position: {x: 3, y:9}, orientation: 'horizontal'})
doors.push({room_id: "room_07", position: {x: 9, y:9}, orientation: 'horizontal'})
doors.push({room_id: "room_08", position: {x: 15, y:9}, orientation: 'horizontal'})
doors.push({room_id: "room_09", position: {x: 21, y:9}, orientation: 'horizontal'})
doors.push({room_id: "room_10", position: {x: 27, y:9}, orientation: 'horizontal'})

const ground_floorplan: FloorGeometry = {
    floor_id: "ground",
    width: 30,
    height: 15,
    outline: [
        {x: 0, y: 0},
        {x: 30, y: 0},
        {x: 30, y: 15},
        {x: 0, y: 15},
    ],
    corridors: [{id: "corridor_1", points: [{x: 0, y: 6}, {x: 0, y: 9}, {x: 30, y: 9}, {x: 30, y: 6}]}],
    rooms: rooms,
    entrances: entrances,
    doors: doors,
};

// ---- Navigation graph ------------------------------------------------------
// Derived from the floorplan so nodes sit exactly on the drawn geometry.
// Layout: the corridor is a horizontal band. Nodes sit on its centreline at every
// x where an entrance or a door is. Each door links straight to the node above/below it.

const corridor = ground_floorplan.corridors[0];
if (!corridor) throw new Error('floorplan has no corridor');
const corridor_ys = corridor.points.map(p => p.y);
const corridor_top = Math.min(...corridor_ys);
const corridor_bottom = Math.max(...corridor_ys);
const centre_y = (corridor_top + corridor_bottom) / 2;

// Validation: fail loudly rather than emit a graph with unreachable rooms or off-wall doors.
for (const door of doors) {
    if (door.position.y !== corridor_top && door.position.y !== corridor_bottom) {
        throw new Error(`door for ${door.room_id} is not on a corridor wall (y=${door.position.y})`);
    }
}
for (const room of building_data.rooms) {
    if (!doors.some(d => d.room_id === room.id)) {
        throw new Error(`room ${room.id} has no door, so it would be unreachable`);
    }
}
for (const door of doors) {
    if (!building_data.rooms.some(r => r.id === door.room_id)) {
        throw new Error(`door refers to unknown room ${door.room_id}`);
    }
}

const floor_id = ground_floorplan.floor_id;
const corridor_xs = [...new Set([
    ...entrances.map(e => e.position.x),
    ...doors.map(d => d.position.x),
])].sort((a, b) => a - b);

const entrance_at_x = new Map(entrances.map(e => [e.position.x, e]));
const corridor_node_at_x = new Map<number, string>();
const nodes: NavigationNode[] = [];
const edges: NavigationEdge[] = [];

// Corridor spine: one node per x, chained left to right.
for (const x of corridor_xs) {
    const entrance = entrance_at_x.get(x);
    const id = entrance ? entrance.entrance_id : `corridor_x_${x}`;
    nodes.push({id, type: entrance ? 'entrance' : 'corridor', floor: floor_id, x, y: centre_y});
    corridor_node_at_x.set(x, id);
}
for (let i = 1; i < corridor_xs.length; i++) {
    const prev_x = corridor_xs[i - 1]!;
    const this_x = corridor_xs[i]!;
    edges.push({from: corridor_node_at_x.get(prev_x)!, to: corridor_node_at_x.get(this_x)!});
}

// Door nodes, each linked to the corridor node directly across from it.
for (const door of doors) {
    const id = `door_${door.room_id}`;
    nodes.push({id, type: 'door', floor: floor_id, room_id: door.room_id, x: door.position.x, y: door.position.y});
    edges.push({from: id, to: corridor_node_at_x.get(door.position.x)!});
}

const ground_navigation: NavigationGraph = {
    building_id: building_data.id,
    nodes,
    edges,
};

import {writeFile} from 'node:fs/promises'

const jsonString_ground_floorplan = JSON.stringify(ground_floorplan, null, 2);
const jsonString_ground_navigation = JSON.stringify(ground_navigation, null, 2);

const outputUrl = new URL('../Buildings/Example_Building/floorplan.json', import.meta.url);
const navigationUrl = new URL('../Buildings/Example_Building/navigation.json', import.meta.url);

await writeFile(outputUrl, jsonString_ground_floorplan, 'utf-8')
await writeFile(navigationUrl, jsonString_ground_navigation, 'utf-8')

console.log(jsonString_ground_floorplan)
      