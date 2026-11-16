from app.dijkstra import dijkstra

def test_dijkstra():
    graph = {
    "A": [{"to": "B", "weight": 2}, {"to": "C", "weight": 10}],
    "B": [{"to": "A", "weight": 2}, {"to": "C", "weight": 3}],
    "C": [{"to": "A", "weight": 10}, {"to": "B", "weight": 3}],
    }
    assert dijkstra(graph, "A", "C") == (["A", "B", "C"], 2) 



    