import React, { useContext } from "react";
import { StyleContext } from "../contexts/StyleContext";
import { MapLibreMap } from "@mapcomponents/react-maplibre";
import { useAddProtocol } from "@mapcomponents/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { mbTilesProtocolHandler } from "../lib/mbtiles";

const Map = () => {
  const styleContext = useContext(StyleContext);

  useAddProtocol({
    protocol: "mbtiles",
    handler: mbTilesProtocolHandler,
  });

  return (
    <>
      <MapLibreMap
        mapId="map_1"
        sourceOptions={{
          maxzoom: 14,
          minzoom: 7,
        }}
        options={{
          style: styleContext.backgroundStyle,
          center: [4.907242068496657, 52.37090794659858],
          zoom: 12,
        }}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      />
    </>
  );
};

export default Map;
