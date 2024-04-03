import React, { useEffect, useState, useContext } from "react";
import { MlFeatureEditor, MlGeoJsonLayer } from "@mapcomponents/react-maplibre";
import { MeasureContext } from "../../contexts/MeasureContext";

export default function MeasureTool() {
  const [intGeom, setIntGeom] = useState();
  const measureContext = useContext(MeasureContext);

  useEffect(
    function () {
      if (!measureContext.active) {
        if (measureContext.geometry) {
          setIntGeom(JSON.parse(JSON.stringify(measureContext.geometry)));
        } else {
          setIntGeom(undefined);
        }
      }
    },
    [measureContext.active, measureContext.geometry]
  );
  return (
    <>
      {measureContext.active && (
        <MlFeatureEditor
          onChange={(features) => {
            if (features[0]) {
              measureContext.setGeometry(features[0]);
            }
          }}
          onFinish={() => {
            // Short delay to avoid featureInfo
            setTimeout(() => {
              measureContext.setIsDrawing(false);
            }, 100);
          }}
          geojson={intGeom}
          mode={intGeom ? "simple_select" : "draw_line_string"}
        />
      )}
      {!measureContext.active && measureContext.geometry && (
        <MlGeoJsonLayer
          geojson={measureContext.geometry}
          paint={{ "line-color": "#3bb2d0" }}
        />
      )}
    </>
  );
}
