import React, { useState, useEffect, useRef } from "react";
import { Collapse, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMapState } from "@mapcomponents/react-maplibre";

export default function ZoomAlert() {
  const alertShownRef = useRef(false);
  const [showAlert, setShowAlert] = useState(false);

  const mapState = useMapState({
    mapId: "map_1",
    watch: {
      viewport: true,
      layers: false,
    },
  });

  useEffect(() => {
    if (!mapState.viewport?.zoom || alertShownRef.current) return;

    if (mapState.viewport.zoom > 15) {
      alertShownRef.current = true;
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 120000);
    }
  }, [mapState.viewport]);

  return (
    <Collapse in={showAlert}>
      <Alert
        severity="info"
        id="alert"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setShowAlert(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        Ab dieser Zoomstufe werden die Geometrien, die als <b>Vectortiles</b>{" "}
        dargestellt wurden, ersetzt durch <b>ungeneralisierten Geometrien</b>{" "}
        die als GeoJson-Layer eingebunden werden.
        <br />
        Diese werden für den aktuellen Kartenausschnitt nachgeladen. Dadurch
        bleibt die Karte auch bei vielen Geometrien performant.
        <br />
        Sie können nun per Klick auf eine Geometrie deren <b>Sachdaten</b>{" "}
        abfragen.
      </Alert>
    </Collapse>
  );
}
