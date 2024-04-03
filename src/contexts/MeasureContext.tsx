import React, { useMemo, useState, createContext, ReactNode } from "react";
import * as turf from "@turf/turf";

export interface MeasureContextType {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  geometry: any;
  setGeometry: any;
  distance: number;
}

const MeasureContext = createContext<MeasureContextType | undefined>(undefined);

interface MeasureContextProviderProps {
  children: ReactNode;
}

const MeasureContextProvider: React.FC<MeasureContextProviderProps> = ({
  children,
}) => {
  const [active, setActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [geometry, setGeometry] = useState(undefined);

  const distance = useMemo(() => {
    if (!geometry) {
      return 0;
    }
    return turf.length(geometry, { units: "kilometers" });
  }, [geometry]);

  const value: MeasureContextType = {
    active,
    setActive,
    isDrawing,
    setIsDrawing,
    distance,
    geometry,
    setGeometry,
  };

  return (
    <>
      <MeasureContext.Provider value={value}>
        {children}
      </MeasureContext.Provider>
    </>
  );
};

export { MeasureContext, MeasureContextProvider };
