const FLOORS = [
  {
    key: "ground",
    label: "Ground",
    svgDir: "ictomb/ground",  // each room is {svgDir}/{roomName}.svg
    rooms: {
      inner01:   { displayName: "Inner Corridor 01", items: [] },
      generator: { displayName: "Generator Room",    items: [] },
      habitat:   { displayName: "Habitat Module",    items: [] },
      core:      { displayName: "Core",              items: [] },
      storage:   { displayName: "Storage",           items: [] },
      stairs:    { displayName: "Stairwell",         items: [] },
      inner02:   { displayName: "Inner Corridor 02", items: [] },
      turbines:  { displayName: "Turbine Hall",      items: [] },
      lift:      { displayName: "Lift Shaft",        items: [] },
      wall01:    { displayName: "Wall Section 01",   items: [] },
      wall03:    { displayName: "Wall Section 03",   items: [] },
      outer03:   { displayName: "Outer Section 03",  items: [] },
      outer01:   { displayName: "Outer Section 01",  items: [] },
      outer02:   { displayName: "Outer Section 02",  items: [] },
      wall02:    { displayName: "Wall Section 02",   items: [] },
    },
  },
  // Future floors — run split_svg.py on each master SVG first:
  // { key: "basement", label: "Basement", svgDir: "ictomb/basement", rooms: { ... } },
  // { key: "first",    label: "First Floor", svgDir: "ictomb/first", rooms: { ... } },
  // { key: "roof",     label: "Roof",     svgDir: "ictomb/roof", rooms: { ... } },
];

export default FLOORS;
