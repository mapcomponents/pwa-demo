import React, { useContext } from "react";
import {
  useMap,
  MlLayer,
  MlVectorTileLayer,
} from "@mapcomponents/react-maplibre";
import { DataContext, DataContextType } from "../contexts/DataContext";
import { dataUrl } from "../lib/tileUrl";
import GeojsonHQLayer from "./GeojsonHQLayer";
import FeatureInfo from "./FeatureInfo/FeatureInfo";

const GridData: React.FC = () => {
  const mapHook = useMap({ mapId: "map_1" });
  const dataContext = useContext<DataContextType | undefined>(DataContext);
  const markerLayers = ["lq-data"];

  return (
    <>
      {Object.entries(dataContext?.dataConfig?.geometryConfig || {}).map(
        ([key, value]) => (
          <GeojsonHQLayer
            key={key}
            layerId={key}
            getGeometryIndexKey={(feature) => feature.properties[value.ID]}
          />
        )
      )}

      {markerLayers.map((layer, idx) => (
        <MlLayer
          layerId={"marker-" + layer}
          options={{
            layout: {
              visibility: "none",
            },
          }}
          key={layer}
          {...(idx > 0
            ? {
                insertBeforeLayer: "marker-" + markerLayers[idx - 1],
              }
            : { insertBeforeLayer: "housenumber" })}
        />
      ))}
      {mapHook.map && dataContext?.dataConfig?.dataTileConfig && (
        <MlVectorTileLayer
          mapId="map_1"
          layerId="lq-data"
          url={dataUrl}
          sourceOptions={{
            type: "vector",
            minzoom:
              dataContext.dataConfig.dataTileConfig.sourceOptions.minzoom,
            maxzoom:
              dataContext.dataConfig.dataTileConfig.sourceOptions.maxzoom,
          }}
          insertBeforeLayer={"marker-lq-data"}
          layers={dataContext.dataConfig.dataTileConfig.layers}
        />
      )}
      <FeatureInfo></FeatureInfo>
    </>
  );
};

export default GridData;
