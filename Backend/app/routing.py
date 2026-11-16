def routing(start_node, end_node, previous):
    path = [end_node]
    while end_node!=start_node:
        end_node = previous[end_node]
        path.append(end_node)
    path.reverse()

    return path