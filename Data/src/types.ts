export type Floor = {
    id: string,
    name: string
}
export type Room = {
    id: string,
    name: string,
    floor: string
}
export type Entrance = {
    id: string,
    name: string,
    floor: string
}

export type Building = {
    id: string,
    name: string,
    floors: Floor[],
    rooms: Room[],
    entrances: Entrance[]
}

//A point is an object with x and y coordinates
export type Point = {x: number, y: number};

export type RoomGeometry = {
    room_id: string,
    //array of points that define the room's shape
    room_points: Point[],
    room_label: Point,
}

//Which way the opening runs: 'horizontal' = a line along x (in a horizontal wall), 'vertical' = a line along y
export type Orientation = 'horizontal' | 'vertical';

//An entrance is a point that defines the location of the entrance to the building
export type EntranceGeometry = {
    entrance_id: string,
    position: Point,
    orientation: Orientation,
}

export type DoorGeometry = {
    room_id: string,
    //the centre of the door opening (2 units wide)
    position: Point,
    orientation: Orientation,
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

//A navigation node is a point a route can pass through. Coordinates use the same space as FloorGeometry.
export type NavigationNode = {
    id: string,
    type: 'entrance' | 'door' | 'corridor',
    floor: string,
    x: number,
    y: number,
    //only set on door nodes
    room_id?: string,
}

//An undirected connection between two nodes. Weights are not stored; they are computed from coordinates at load time.
export type NavigationEdge = {
    from: string,
    to: string,
}

export type NavigationGraph = {
    building_id: string,
    nodes: NavigationNode[],
    edges: NavigationEdge[],
}
