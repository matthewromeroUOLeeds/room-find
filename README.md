# room-find

University building navigation: find a room and get a route to it, drawn on the floorplan.

## Structure

| Folder | What it is | Status |
| --- | --- | --- |
| `Data/` | Building definitions (`Buildings/<name>/building.json`) and the TypeScript generator that produces `floorplan.json` | Working |
| `Frontend/` | React + TypeScript + Vite app that renders the floorplan as SVG (`FloorPlan.tsx`) | Floorplan rendering working |
| `Backend/` | Reserved for a future API | Empty |

## Coordinates

All geometry uses floorplan units with the origin at the top-left and y increasing downward, matching SVG. Graph and route coordinates share this space, so they can be drawn on the SVG without scaling.

## Shared types

Geometry types are defined in `Data/src/types.ts`. `Frontend/src/types/floorplan.ts` is currently a hand-copied duplicate and should be replaced with an import from the Data types so the two cannot drift.

## Running

Requires Node.js 20+.

### Data

```sh
cd Data
npm install
npm run generate   # compiles, then writes Buildings/Example_Building/floorplan.json
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
2. Generate a navigation graph (`navigation.json`) from the floorplan, with nodes on the same coordinates as the SVG.
3. Shortest-path routing with tests.
4. Room and entrance pickers, route overlay.
5. Later: multiple floors and buildings, backend.
