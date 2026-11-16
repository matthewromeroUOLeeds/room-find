import json

def load_navigation():
    with open("../../Data/Buildings/Test_Building/navigation.json") as json_file:
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

    return nodes_by_id, adjacency_list