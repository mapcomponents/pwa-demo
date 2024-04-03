const dataTileConfig = {
  sourceOptions: {
    maxzoom: 15,
    minzoom: 7,
  },
  insertBeforeLayer: "marker-lq-data",
  layers: [
    {
      id: "lq-data_tram_line",
      "source-layer": "tram_line",
      type: "line",
      source: "lq-data",
      layout: {},
      paint: {
        "line-color": ["step", ["zoom"], "#22b14c", 15, "rgba(0,0,0,0)"],
        "line-width": 2,
      },
      maxzoom: 24,
      minzoom: 7,
    },
    {
      id: "lq-data_tramhalte_point",
      "source-layer": "tramhalte_point",
      type: "circle",
      source: "lq-data",
      layout: {},
      paint: {
        "circle-color": ["step", ["zoom"], "#ffffff", 15, "rgba(0,0,0,0)"],
        "circle-stroke-width": 2,
        "circle-stroke-color": [
          "step",
          ["zoom"],
          "#22b14c",
          15,
          "rgba(0,0,0,0)",
        ],
        "circle-radius": 10,
      },
      maxzoom: 24,
      minzoom: 7,
    },
  ],
};
export default dataTileConfig;
