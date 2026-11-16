import json

with open("../Data/Buildings/Test_Building/navigation.json") as json_file:
    json_data = json.load(json_file)


nodes_by_id = {str(node["id"]): node for node in json_data["nodes"]}
adjacency_list = {str(node["id"]): [] for node in json_data["nodes"]}

for edge in json_data["edges"]:
    from_id = edge["from"]
    to_id = edge["to"]

    from_node = nodes_by_id[from_id]
    to_node = nodes_by_id[to_id]

    weight = abs(from_node["x"] - to_node["x"] + from_node["y"] - to_node["y"])

    adjacency_list[from_id].append({"to": to_id, "weight": weight})
    adjacency_list[to_id].append({"to": from_id, "weight": weight})


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

    end_node = room_id
    start_node = entrance

    path = [room_id]
    while end_node!=start_node:
        end_node = previous[end_node]
        path.append(end_node)

    path.reverse()
    return path



entrance = "entrance_01"
room_id = "room_03"

path = dijkstra(adjacency_list,entrance,room_id)


path_points = [{"x": nodes_by_id[id]["x"], "y": nodes_by_id[id]["y"]} for id in path]

with open("route.json", "w", encoding="utf-8") as file:
    json.dump(path_points, file, indent=2)






