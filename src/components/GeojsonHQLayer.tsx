import React, { useContext } from "react";
import useGeojsonHq from "../hooks/useGeojsonHq";
import { DataContext, DataContextType } from "../contexts/DataContext";
import { MlGeoJsonLayer } from "@mapcomponents/react-maplibre";

interface GeojsonHQLayerProps {
  layerId: string;
  getGeometryIndexKey: (feature: any) => string;
}

const GeojsonHQLayer: React.FC<GeojsonHQLayerProps> = ({
  layerId,
  getGeometryIndexKey,
}) => {
  const dataContext = useContext<DataContextType | undefined>(DataContext);
  const geojsonData = useGeojsonHq({
    lqLayerId: `lq-data_${layerId}`,
    getGeometryIndexKey,
  });

  const config = dataContext?.dataConfig?.geometryConfig[layerId];

  return geojsonData && config ? (
    <>
      {config.type === "circle" && (
        <MlGeoJsonLayer
          type="circle"
          geojson={geojsonData}
          layerId={`hq-${layerId}`}
          options={{
            maxzoom: config.maxzoom || 24,
            minzoom: config.minzoom || 16,
            paint: { ...config.paint },
          }}
          insertBeforeLayer={`housenumber`}
        />
      )}
      {config.type === "line" && (
        <MlGeoJsonLayer
          type="line"
          geojson={geojsonData}
          layerId={`hq-${layerId}`}
          options={{
            maxzoom: config.maxzoom || 24,
            minzoom: config.minzoom || 16,
            paint: { ...config.paint },
          }}
          insertBeforeLayer={`housenumber`}
        />
      )}
    </>
  ) : null;
};

export default GeojsonHQLayer;
