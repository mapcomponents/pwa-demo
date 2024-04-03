import React from "react";
import ReactDOM from "react-dom/client";
import { MapComponentsProvider } from "@mapcomponents/react-maplibre";
import { StyleContextProvider } from "./contexts/StyleContext";
import { DataContextProvider } from "./contexts/DataContext";
import { GeometryContextProvider } from "./contexts/GeometryContext";
import { SelectionContextProvider } from "./contexts/SelectionContext";
import { MeasureContextProvider } from "./contexts/MeasureContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StyleContextProvider>
      <MapComponentsProvider>
        <MeasureContextProvider>
          <SelectionContextProvider>
            <GeometryContextProvider>
              <DataContextProvider>
                <App />
              </DataContextProvider>
            </GeometryContextProvider>
          </SelectionContextProvider>
        </MeasureContextProvider>
      </MapComponentsProvider>
    </StyleContextProvider>
  </React.StrictMode>
);
