import { Feature } from "@turf/helpers";
import { createContext, useState } from "react";

export interface SelectionContextType {
  infoGeometry: (Feature & { id: string; source: string }) | undefined;
}

const SelectionContext = createContext({} as SelectionContextType);

const SelectionContextProvider = ({ children }) => {
  const [infoGeometry, setInfoGeometry] = useState<Feature | undefined>(
    undefined
  );

  const value = {
    infoGeometry,
    setInfoGeometry,
  } as unknown as SelectionContextType;

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export default SelectionContext;
export { SelectionContextProvider };
