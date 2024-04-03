import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  ReactNode,
} from "react";
import pwaUrl from "../lib/pwaUrl";
import config from "../../pwa_config/config.json";
import dataTileConfig from "../../pwa_config/dataTileConfig.js";
import { PwaConfig } from "../types/PwaConfig";
interface DataState {
  [key: string]: any;
}

export interface DataContextType {
  data: DataState;
  loadingGeojsonData: boolean;
  setLoadingGeojsonData: React.Dispatch<React.SetStateAction<boolean>>;
  dataConfig?: PwaConfig;
  loadingDataLayers: boolean;
  setLoadingDataLayers: React.Dispatch<React.SetStateAction<boolean>>;
  getGeometry: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataContextProviderProps {
  children: ReactNode;
}

const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
}) => {
  const initializedRef = useRef<boolean>(false);
  const [data, setData] = useState<DataState>({});
  const [dataConfig, setDataConfig] = useState<PwaConfig | undefined>(
    undefined
  );
  const [loadingGeojsonData, setLoadingGeojsonData] = useState<boolean>(true);
  const [loadingDataLayers, setLoadingDataLayers] = useState<boolean>(true);
  const [geoJsonSources, setGeoJsonSources] = useState<string[]>([]);

  const dataUrl = pwaUrl + "app_data/geojson/";

  const loadGeoJsonFiles = useCallback(() => {
    geoJsonSources.forEach((source) => {
      fetch(dataUrl + source)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch geojson data from ${source}`);
          }
          return res.json();
        })
        .then((geojsonData) => {
          setData((existingData) => ({
            ...existingData,
            [source]: geojsonData,
          }));
        })
        .catch((err) => {
          console.error("Error loading GeoJSON files:", err.message);
        });
    });
  }, [geoJsonSources]);

  const getGeometry = useCallback(
    (params, index) => {
      if (!params || !index) return undefined;

      const sourceFileName = "data/" + params.source;
      const featureCollection = data[sourceFileName];

      if (!featureCollection || !Array.isArray(featureCollection.features)) {
        return undefined;
      }

      const IDs = Object.keys(config.geometryConfig)
        .filter((key) => config.geometryConfig[key].path === sourceFileName)
        .map((key) => config.geometryConfig[key].ID);

      const matchingFeatures = IDs.map((id) =>
        featureCollection.features.find(
          (feature) => feature.properties[id] === index || feature[id] === index
        )
      ).filter((feature) => feature !== undefined);

      return matchingFeatures?.[0];
    },
    [data, config]
  );

  useEffect(() => {
    if (!config?.geometryConfig) return;
    config.dataTileConfig = dataTileConfig;

    const extractedSources = Object.keys(config.geometryConfig).map((key) => {
      const item = config.geometryConfig[key];
      return item.path;
    });
    setGeoJsonSources(extractedSources);
    setDataConfig(config as any);
    setLoadingGeojsonData(false);
  }, []);

  useEffect(() => {
    let dataLoading = false;

    geoJsonSources.forEach((el) => {
      if (!data[el]) {
        dataLoading = true;
      }
    });

    if (!dataLoading) {
      setLoadingGeojsonData(false);
    }
  }, [data]);

  useEffect(() => {
    if (geoJsonSources.length > 0) {
      loadGeoJsonFiles();
    }
  }, [geoJsonSources, loadGeoJsonFiles]);

  useEffect(() => {
    let dataLoading = false;
    if (data.geoJsonSources) {
      data.geoJsonSources.forEach((source: string) => {
        if (!data[source]) {
          dataLoading = true;
        }
      });
    }

    setLoadingGeojsonData(dataLoading);
  }, [data, loadGeoJsonFiles]);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;
    loadGeoJsonFiles();
  }, [loadGeoJsonFiles]);

  const value: DataContextType = {
    data,
    loadingGeojsonData,
    setLoadingGeojsonData,
    dataConfig,
    loadingDataLayers,
    setLoadingDataLayers,
    getGeometry,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export { DataContext, DataContextProvider };
