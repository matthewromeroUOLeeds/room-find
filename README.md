# room-find

University building navigation: find a room and get a route to it, drawn on the floorplan.

## Structure

| Folder | What it is | Status |
| --- | --- | --- |
| `Data/` | Building definitions (`Buildings/<name>/building.json`) and the TypeScript generator that produces `floorplan.json` and `navigation.json` | Working |
| `Frontend/` | React + TypeScript + Vite app that renders the floorplan as SVG (`FloorPlan.tsx`) | Floorplan rendering and graph overlay working |
| `Backend/` | Reserved for a future API | Empty |

## Coordinates

All geometry uses floorplan units with the origin at the top-left and y increasing downward, matching SVG. Graph and route coordinates share this space, so they can be drawn on the SVG without scaling.

## Shared types

Geometry and navigation types live in `Data/src/types.ts`. The frontend imports them directly (`../../Data/src/types`), so there is a single definition.

## Generated data

`npm run generate` in `Data/` writes two files per building, both derived from the same geometry:

- `floorplan.json`: outline, corridors, rooms, doors and entrances (doors and entrances carry an `orientation`).
- `navigation.json`: graph nodes (`entrance`, `door`, `corridor`) and edges. Edge weights are not stored; the frontend computes them from node coordinates (`Frontend/src/graph.ts`).

The generator fails if a room has no door or a door is not on a corridor wall.

## Running

Requires Node.js 20+.

### Data

```sh
cd Data
npm install
npm run generate   # compiles, then writes floorplan.json and navigation.json for each building
```

`Data/dist/` is build output and is not committed.

### Frontend

```sh
cd Frontend
npm install
npm run dev        # dev server
npm run build      # type-check and production build
npm run lint
```

## Roadmap

1. ~~Render `floorplan.json` as SVG.~~ Done.
2. ~~Generate a navigation graph (`navigation.json`) from the floorplan, with nodes on the same coordinates as the SVG.~~ Done; toggle "Show navigation graph" in the app to see it.
3. Shortest-path routing with tests.
4. Room and entrance pickers, route overlay.
5. Later: multiple floors and buildings, backend.
