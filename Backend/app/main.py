import json
from dijkstra import dijkstra
from load_navigation import load_navigation
from routing import routing

def main():
    nodes_by_id, adjacency_list = load_navigation()

    entrance = "entrance_01"
    room_id = "room_07"

    distances, previous = dijkstra(adjacency_list,entrance,room_id)

    path = routing(entrance, room_id, previous)
    print(path)

    path_points = [{"x": nodes_by_id[id]["x"], "y": nodes_by_id[id]["y"]} for id in path]

    with open("../output/route.json", "w", encoding="utf-8") as file:
        json.dump(path_points, file, indent=2)


if __name__ == "__main__":
    main()



