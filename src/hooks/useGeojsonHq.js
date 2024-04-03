import { useMap, useMapState } from "@mapcomponents/react-maplibre";
import React, { useState, useEffect, useRef, useContext } from "react";
// import { AppContext } from '../contexts/AppContext';
import { DataContext } from "../contexts/DataContext";
import { GeometryContext } from "../contexts/GeometryContext";

export default function useGeojsonHq({ key, lqLayerId, getGeometryIndexKey }) {
  const mapHook = useMap({ mapId: "map_1" });
  const [lowDetail, setLowDetail] = useState(true);
  const lowDetailRef = useRef(true);
  const zoomRef = useRef();
  const lastZoomChangeRef = useRef(new Date().getTime());
  const [data, setData] = useState();
  // const appContext = useContext(AppContext);
  const dataContext = useContext(DataContext);
  const geometryContext = useContext(GeometryContext);
  const mapState = useMapState({
    mapId: "map_1",
    watch: {
      viewport: true,
      layers: false,
    },
  });

  useEffect(() => {
    setLowDetail(true);
    lowDetailRef.current = true;
    if (zoomRef.current !== mapState.viewport?.zoom) {
      zoomRef.current = mapState.viewport.zoom;
    }

    if (zoomRef.current > 15) {
      lastZoomChangeRef.current = new Date().getTime();
      setTimeout(() => {
        if (new Date().getTime() - lastZoomChangeRef.current >= 50) {
          setLowDetail(false);
          lowDetailRef.current = false;
        }
      }, 100);
    }
  }, [mapState.viewport]);

  useEffect(() => {
    if (mapHook.map && !lowDetail && !dataContext.loadingGeojsonData) {
      let geojson = {
        type: "FeatureCollection",
        features: [],
      };

      let renderedFeatures = mapHook.map?.queryRenderedFeatures({
        layers: [lqLayerId],
      });

      geojson.features = renderedFeatures.map((feat) => {
        let indexKey = getGeometryIndexKey(feat);
        if (typeof indexKey === "undefined") {
          indexKey = feat.id;

          return dataContext.getGeometry(
            geometryContext.geometryIndex?.[indexKey],
            indexKey
          );
        } else {
          return dataContext.getGeometry(
            geometryContext.geometryIndex?.[indexKey],
            indexKey
          );
        }
      });
      setData(geojson);
    }
  }, [
    lowDetail,
    mapHook.viewport,
    mapHook.map,
    geometryContext,
    dataContext.getGeometry,
    //appContext.styleChanged,
    // getGeometryIndexKey,
    lqLayerId,
  ]);

  return data;
}
