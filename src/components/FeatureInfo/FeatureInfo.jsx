import React, { useContext, useEffect, useState, useRef } from "react";
import { useMap, MlGeoJsonLayer } from "@mapcomponents/react-maplibre";
import InfoTemplate from "./InfoTemplate";
import config from "../../../pwa_config/config.json";
import { DataContext } from "../../contexts/DataContext";
import { GeometryContext } from "../../contexts/GeometryContext";
import Typography from "@mui/material/Typography";
import getDefaultLayerTypeByGeometry from "./getDefaultLayerTypeByGeometry";
import SelectionContext from "../../contexts/SelectionContext";
import { Sidebar } from "@mapcomponents/react-maplibre";

const getLayerNameByUuid = (config, uuid) => {
  if (config && config.layers) {
    for (let i = 0; i < config.layers.length; i++) {
      const layer = config.layers[i];
      if (layer.uuid === uuid.replace("source-", "")) {
        return layer.resource_path;
      }
      if (layer.layers) {
        const resourcePath = getLayerNameByUuid(layer, uuid);
        if (resourcePath) {
          return resourcePath;
        }
      }
    }
  }
  return undefined;
};

function FeatureInfo() {
  const hoveredLayers = useRef([]);
  const dataContext = useContext(DataContext);
  const geometryContext = useContext(GeometryContext);
  const selectionContext = useContext(SelectionContext);
  const mapHook = useMap({ mapId: "map_1" });
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!mapHook.map) return;

    let layers = Object.keys(config.geometryConfig).map((key) => {
      return "hq-" + key;
    });
    console.log(layers);

    const _clickHandler = (e) => {
      if (mapHook.map.getZoom() < 15) return;

      const bbox = [
        [e.point.x - 12, e.point.y - 12],
        [e.point.x + 12, e.point.y + 12],
      ];

      const f = mapHook.map.queryRenderedFeatures(bbox, {
        layers: layers,
      });

      console.log(f);

      let infoFeature = undefined;
      f.forEach((el) => {
        if (
          el.layer.type === "line" &&
          (!infoFeature || infoFeature?.layer?.type === "fill")
        ) {
          infoFeature = el;
        }
        if (
          el.layer.type === "circle" &&
          (!infoFeature ||
            infoFeature?.layer?.type === "fill" ||
            infoFeature?.layer?.type === "line")
        ) {
          infoFeature = el;
        }

        if (el.layer.type === "fill" && !infoFeature) {
          infoFeature = el;
        }
      });
      if (infoFeature) {
        const geometryConfig = dataContext?.dataConfig?.geometryConfig;
        console.log(infoFeature);

        let geojsonFeature;
        let feature_id = [""];

        if (geometryConfig) {
          Object.entries(geometryConfig).forEach(([key, value]) => {
            const layerIdWithoutPrefix = infoFeature.layer.id.replace(
              "hq-",
              ""
            );
            console.log(layerIdWithoutPrefix);
            if (key === layerIdWithoutPrefix) {
              console.log(key);
              const featureIdProperty = value.ID;
              console.log(featureIdProperty);
              if (featureIdProperty) {
                feature_id = infoFeature.properties[featureIdProperty];
                console.log(feature_id);
                if (!feature_id) {
                  feature_id = infoFeature[featureIdProperty];
                }
              }
              console.log(feature_id);
              geojsonFeature = dataContext.getGeometry(
                geometryContext.geometryIndex?.[feature_id],
                feature_id
              );
            }
            console.log(geojsonFeature);
            selectionContext.setInfoGeometry(geojsonFeature);
          });
        }
      }
    };
    const makeMouseEnterHandler = (layerId) => {
      return (ev) => {
        if (mapHook.map.getZoom() < 15) return;

        mapHook.map.getCanvas().style.cursor = "grab";
        hoveredLayers.current.push(layerId);
      };
    };
    const makeMouseLeaveHandler = (layerId) => {
      return () => {
        hoveredLayers.current.splice(hoveredLayers.current.indexOf(layerId), 1);
        if (hoveredLayers.current.length === 0) {
          mapHook.map.getCanvas().style.cursor = "";
        }
      };
    };
    mapHook.map.on("click", _clickHandler);
    let handlers = {};
    layers.forEach((el) => {
      handlers[el] = {
        enter: makeMouseEnterHandler(el),
        leave: makeMouseLeaveHandler(el),
      };
      mapHook.map.on("mouseenter", el, handlers[el].enter);
      mapHook.map.on("mouseleave", el, handlers[el].leave);
    });
    hoveredLayers.current = [];
    return () => {
      mapHook.map.off("click", _clickHandler);
      layers.forEach((el) => {
        mapHook.map.off("mousemove", el, handlers[el].enter);
        mapHook.map.off("mouseleave", el, handlers[el].leave);
      });
    };
  }, [mapHook.map, selectionContext, dataContext.dataConfig]);

  useEffect(() => {
    return () => {
      selectionContext.setInfoGeometry(false);
    };
  }, []);

  return (
    <>
      {selectionContext?.infoGeometry && (
        <>
          <Sidebar
            open={selectionContext.infoGeometry}
            setOpen={selectionContext.setInfoGeometry}
            name={"Feature Info"}
          >
            <Typography>Geometry Properties</Typography>

            <InfoTemplate
              geometry={selectionContext.infoGeometry}
            ></InfoTemplate>
          </Sidebar>

          <MlGeoJsonLayer
            geojson={selectionContext.infoGeometry.geometry}
            type={getDefaultLayerTypeByGeometry(selectionContext.infoGeometry)}
            defaultPaintOverrides={{
              circle: {
                "circle-radius": 12,
                "circle-color": "rgba(240,234,110,0.9)",
              },
              line: {
                "line-color": "rgba(240,234,110,0.9)",
                "line-width": 7,
              },
              fill: {
                "fill-color": "rgba(240,234,110,0.9)",
              },
            }}
          />
        </>
      )}
    </>
  );
}

export default FeatureInfo;
