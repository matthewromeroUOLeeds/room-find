import { describe, expect, it } from 'vitest'
import { describeRoute } from './describeRoute'
import { buildGraph } from './graph'
import { shortestPath } from './routing'
import type { NavigationGraph } from '../../Data/src/types'

import navigation_data from '../../Data/Buildings/Example_Building/navigation.json' with {type: 'json'}

const graph = buildGraph(navigation_data as NavigationGraph)

describe('describeRoute', () => {
    it('names the entrance, the room and the distance', () => {
        const route = shortestPath(graph, 'entrance_01', 'door_room_05')!
        expect(describeRoute(graph, route)).toBe('Route from entrance_01 to room_05: 28.5 units.')
    })

    it('uses room names for door nodes at both ends', () => {
        const route = shortestPath(graph, 'door_room_01', 'door_room_06')!
        expect(describeRoute(graph, route)).toBe('Route from room_01 to room_06: 3.0 units.')
    })

    it('handles a route that starts where it ends', () => {
        const route = shortestPath(graph, 'door_room_03', 'door_room_03')!
        expect(describeRoute(graph, route)).toBe('You are already at room_03.')
    })
})
