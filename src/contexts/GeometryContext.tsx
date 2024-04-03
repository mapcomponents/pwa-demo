import React, { useEffect, useState, createContext, ReactNode } from "react";
import pwaUrl from "../lib/pwaUrl";

interface GeometryIndex {
  [key: string]: any;
}

interface GeometryContextProviderProps {
  children: ReactNode;
}

interface GeometryContextType {
  geometryIndex: GeometryIndex;
}

const defaultGeometryContextValue: GeometryContextType = {
  geometryIndex: {},
};

const GeometryContext = createContext<GeometryContextType>(
  defaultGeometryContextValue
);

const GeometryContextProvider: React.FC<GeometryContextProviderProps> = ({
  children,
}) => {
  const [geometryIndex, setGeometryIndex] = useState<GeometryIndex>({});

  useEffect(() => {
    fetch(pwaUrl + "app_data/search/geometryIndex.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then((data: GeometryIndex) => {
        setGeometryIndex(data);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }, []);

  const value = { geometryIndex };

  return (
    <GeometryContext.Provider value={value}>
      {children}
    </GeometryContext.Provider>
  );
};

export { GeometryContext, GeometryContextProvider };
