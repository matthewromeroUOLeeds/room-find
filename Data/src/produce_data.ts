import type { Point, RoomGeometry, EntranceGeometry, DoorGeometry, FloorGeometry } from './types.js';

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
    entrances.push({entrance_id: building_data.entrances[0].id, position: {x:0 ,y:7.5}})
}
if (building_data.entrances[1]) {
    entrances.push({entrance_id: building_data.entrances[1].id, position: {x:30 ,y:7.5}})
}

const doors: DoorGeometry[] = [];
doors.push({room_id: "room_01", position: {x: 3, y:6}})
doors.push({room_id: "room_02", position: {x: 9, y:6}})
doors.push({room_id: "room_03", position: {x: 15, y:6}})
doors.push({room_id: "room_04", position: {x: 21, y:6}})
doors.push({room_id: "room_05", position: {x: 27, y:6}})
doors.push({room_id: "room_06", position: {x: 3, y:9}})
doors.push({room_id: "room_07", position: {x: 9, y:9}})
doors.push({room_id: "room_08", position: {x: 15, y:9}})
doors.push({room_id: "room_09", position: {x: 21, y:9}})
doors.push({room_id: "room_10", position: {x: 27, y:9}})

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

import {writeFile} from 'node:fs/promises'

const jsonString_ground_floorplan = JSON.stringify(ground_floorplan, null, 2);

const outputUrl = new URL('../Buildings/Example_Building/floorplan.json', import.meta.url);

await writeFile(outputUrl, jsonString_ground_floorplan, 'utf-8')

console.log(jsonString_ground_floorplan)
      