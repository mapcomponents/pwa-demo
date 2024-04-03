import React, { useContext } from "react";
import { IconButton, Stack, Box } from "@mui/material";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { MeasureContext } from "../../contexts/MeasureContext";

const MeasureUI = () => {
  const measureContext = useContext(MeasureContext);

  const handleClearMeasurementClick = () => {
    measureContext.setGeometry(undefined);
    measureContext.setActive(false);
    measureContext.setIsDrawing(false);
  };

  const displayMeasurement = () => {
    const length = measureContext.distance;
    // Display in meters up to 999m
    if (length <= 0.999) {
      return `${Math.round(length * 1000)} m`;
    } else {
      return `${length.toFixed(3)} km`;
    }
  };

  return (
    <Stack direction="row" style={{ marginTop: "40px" }}>
      {measureContext.geometry && (
        <>
          <Box
            component="span"
            sx={{
              visibility: "visible",
              position: "absolute",
              my: 1,
              p: 1,
              //   bgcolor: "grey.800",
              color: "black",
              //   border: "1px solid",
              //   borderColor: "grey.800",
              borderRadius: 1,
              fontFamily: "sans-serif",
              fontSize: "1.5 rem",
              fontWeight: "700",
            }}
          >
            {displayMeasurement()}
            <IconButton
              size="large"
              title="Messung entfernen"
              onClick={handleClearMeasurementClick}
            >
              <HighlightOffOutlinedIcon style={{ color: "black" }} />
            </IconButton>
          </Box>
        </>
      )}
    </Stack>
  );
};

export default MeasureUI;
