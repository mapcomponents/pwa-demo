import React, { useState, useEffect, useRef } from "react";
import { Collapse, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function WelcomeAlert() {
  const alertShownRef = useRef(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (alertShownRef.current) return;
    alertShownRef.current = true;
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 9000);
  }, []);

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
        <b>Progressive-Web-App-Demo</b> <br />
        Diese Anwendung ist nach erstmaligem Laden komplett{" "}
        <b>offline nutzbar</b>. <br />
        Für <b>FeatureInfo</b> bitte in die Karte hineinzoomen. <br />
      </Alert>
    </Collapse>
  );
}
