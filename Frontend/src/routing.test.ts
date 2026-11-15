import { describe, expect, it } from 'vitest'
import { buildGraph } from './graph'
import { shortestPath } from './routing'
import type { NavigationGraph, NavigationNode } from '../../Data/src/types'

import navigation_data from '../../Data/Buildings/Example_Building/navigation.json' with {type: 'json'}

const example = buildGraph(navigation_data as NavigationGraph)

//Door x positions, written out by hand so the expected distances do not depend on the generator.
//Rooms 1-5 are the top row and rooms 6-10 the bottom row; both rows have doors at the same x values.
const DOOR_X: Record<string, number> = {
    room_01: 3, room_02: 9, room_03: 15, room_04: 21, room_05: 27,
    room_06: 3, room_07: 9, room_08: 15, room_09: 21, room_10: 27,
}
const FLOOR_WIDTH = 30
//Each door is 1.5 units from the corridor centreline (y=6 or y=9 to y=7.5).
const DOOR_TO_CORRIDOR = 1.5

const node = (id: string, x: number, y: number): NavigationNode => ({id, type: 'corridor', floor: 'ground', x, y})

describe('shortestPath on the example building', () => {
    for (const [room, x] of Object.entries(DOOR_X)) {
        it(`routes entrance_01 to ${room}`, () => {
            const route = shortestPath(example, 'entrance_01', `door_${room}`)
            expect(route).not.toBeNull()
            expect(route!.nodes[0]).toBe('entrance_01')
            expect(route!.nodes.at(-1)).toBe(`door_${room}`)
            expect(route!.distance).toBeCloseTo(x + DOOR_TO_CORRIDOR)
        })

        it(`routes entrance_02 to ${room}`, () => {
            const route = shortestPath(example, 'entrance_02', `door_${room}`)
            expect(route).not.toBeNull()
            expect(route!.nodes[0]).toBe('entrance_02')
            expect(route!.nodes.at(-1)).toBe(`door_${room}`)
            expect(route!.distance).toBeCloseTo(FLOOR_WIDTH - x + DOOR_TO_CORRIDOR)
        })
    }

    it('only steps between nodes that share an edge', () => {
        const route = shortestPath(example, 'entrance_01', 'door_room_10')!
        for (let i = 1; i < route.nodes.length; i++) {
            const a = route.nodes[i - 1]!
            const b = route.nodes[i]!
            expect(example.adjacency.get(a)!.some(n => n.to === b)).toBe(true)
        }
    })

    it('measures the full corridor between the two entrances', () => {
        expect(shortestPath(example, 'entrance_01', 'entrance_02')!.distance).toBeCloseTo(FLOOR_WIDTH)
    })

    it('routes between rooms through the corridor', () => {
        //room_01 and room_06 face each other across the corridor: 1.5 in, 1.5 out
        expect(shortestPath(example, 'door_room_01', 'door_room_06')!.distance).toBeCloseTo(3)
        //room_01 to room_10: 1.5 + 24 along the corridor + 1.5
        expect(shortestPath(example, 'door_room_01', 'door_room_10')!.distance).toBeCloseTo(27)
    })

    it('gives the same distance in both directions', () => {
        const there = shortestPath(example, 'entrance_01', 'door_room_07')!
        const back = shortestPath(example, 'door_room_07', 'entrance_01')!
        expect(back.distance).toBeCloseTo(there.distance)
        expect(back.nodes).toEqual([...there.nodes].reverse())
    })

    it('returns a zero-length route when start and destination are the same', () => {
        expect(shortestPath(example, 'door_room_03', 'door_room_03')).toEqual({nodes: ['door_room_03'], distance: 0})
    })
})

describe('shortestPath edge cases', () => {
    it('returns null when the destination is unreachable', () => {
        const graph = buildGraph({
            building_id: 'test',
            nodes: [node('A', 0, 0), node('B', 1, 0), node('C', 5, 5)],
            edges: [{from: 'A', to: 'B'}],
        })
        expect(shortestPath(graph, 'A', 'C')).toBeNull()
    })

    it('takes the direct edge when it is shorter than the detour', () => {
        //A-C is 5 long; A-B-C is 3 + 4 = 7
        const graph = buildGraph({
            building_id: 'test',
            nodes: [node('A', 0, 0), node('B', 3, 0), node('C', 3, 4)],
            edges: [{from: 'A', to: 'B'}, {from: 'B', to: 'C'}, {from: 'A', to: 'C'}],
        })
        const route = shortestPath(graph, 'A', 'C')!
        expect(route.nodes).toEqual(['A', 'C'])
        expect(route.distance).toBeCloseTo(5)
    })

    it('throws on an unknown start or destination id', () => {
        expect(() => shortestPath(example, 'nope', 'door_room_01')).toThrow(/unknown start node/)
        expect(() => shortestPath(example, 'entrance_01', 'nope')).toThrow(/unknown destination node/)
    })
})

describe('buildGraph', () => {
    it('computes weights from node coordinates', () => {
        const graph = buildGraph({
            building_id: 'test',
            nodes: [node('A', 0, 0), node('B', 3, 4)],
            edges: [{from: 'A', to: 'B'}],
        })
        expect(graph.edges[0]!.weight).toBeCloseTo(5)
    })

    it('rejects an edge that refers to an unknown node', () => {
        expect(() => buildGraph({
            building_id: 'test',
            nodes: [node('A', 0, 0)],
            edges: [{from: 'A', to: 'missing'}],
        })).toThrow(/unknown node/)
    })
})
