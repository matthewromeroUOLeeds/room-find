//A point is an object with x and y coordinates
export type Point = {x: number, y: number};

export type RoomGeometry = {
    room_id: string,
    //array of points that define the room's shape
    room_points: Point[],
    room_label: Point,
}

//An entrance is a point that defines the location of the entrance to the building
export type EntranceGeometry = {
    entrance_id: string,
    position: Point,
}

export type DoorGeometry = {
    room_id: string,
    //the start and end points of the door (2 units wide)
    position: Point
}

//Floor geometry is the shape of the floor, including the outline, corridors, rooms, entrances, and doors
export type FloorGeometry = {
    floor_id: string,
    width: number,
    height: number,
    outline: Point[],
    //An array of one corridor. Array of points define continuous shape.
    corridors: {id: string, points: Point[]}[],
    rooms: RoomGeometry[],
    entrances: EntranceGeometry[],
    doors: DoorGeometry[],
}
