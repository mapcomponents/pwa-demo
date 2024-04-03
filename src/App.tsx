import "./App.css";
import { useContext } from "react";
import Map from "./components/Map";
import GridData from "./components/GridData";
import ReloadPrompt from "./components/ReloadPrompt";
import Toolbar from "./components/Toolbar";
import {
  MlNavigationTools,
  MlCreatePdfButton,
} from "@mapcomponents/react-maplibre";
import ZoomAlert from "./components/ZoomAlert";
import MeasureUI from "./components/measureTool/MeasureUI";
import MeasureTool from "./components/measureTool/MeasureTool";
import { IconButton } from "@mui/material";
import StraightenTwoToneIcon from "@mui/icons-material/StraightenTwoTone";
import StraightenIcon from "@mui/icons-material/Straighten";
import { MeasureContext, MeasureContextType } from "./contexts/MeasureContext";
import WelcomeALert from "./components/WelcomeAlert";
import ClientSearch from "./components/ClientSearch";

function App() {
  const measureContext = useContext<MeasureContextType | undefined>(
    MeasureContext
  );

  const handleIconClick = () => {
    // Toggle Tool state
    measureContext?.setActive(!measureContext.active);
    measureContext?.setIsDrawing(!measureContext.active);
  };

  return (
    <>
      <Map />
      <GridData />
      <ReloadPrompt />
      <Toolbar
        unmovableButtons={<ClientSearch />}
        buttons={
          <>
            <IconButton
              size="large"
              sx={{ mr: 2 }}
              title="Messen"
              onClick={handleIconClick}
            >
              {measureContext?.active ? (
                <StraightenTwoToneIcon style={{ color: "#3bb2d0" }} />
              ) : (
                <StraightenIcon style={{ color: "black" }} />
              )}
            </IconButton>
            <MlCreatePdfButton />
          </>
        }
      />
      <MlNavigationTools showFollowGpsButton={false} showZoomButtons={false} />
      <ZoomAlert />
      <MeasureUI />
      <MeasureTool />
      <WelcomeALert />
    </>
  );
}

export default App;
