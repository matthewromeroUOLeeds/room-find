#Dijkstras Algorithm
import heapq

def dijkstra(adjacency_list, entrance, room_id):

    distances = {node : float("inf")  for node in adjacency_list}
    previous = {node : None for node in adjacency_list}

    visited = set()

    pq = [(0,entrance)]

    while pq :

        current_dist, current_node = heapq.heappop(pq)

        if current_node in visited:
            continue

        visited.add(current_node)

        if current_node == room_id:
            break

        for edge in adjacency_list[current_node]:
            neighbour_id = edge["to"]
            edge_weight = edge["weight"]

            if neighbour_id in visited:
                continue

            new_dist = current_dist + edge_weight

            if new_dist < distances[neighbour_id]:
                distances[neighbour_id] = new_dist
                previous[neighbour_id] = current_node
                heapq.heappush(pq, (new_dist, neighbour_id))

    return distances, previous

