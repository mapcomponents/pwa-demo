import { MlGeoJsonLayerProps } from "@mapcomponents/react-maplibre/dist/components/MlGeoJsonLayer/MlGeoJsonLayer";

export type PwaConfig = {
  /**
   * PWA name
   */
  name: string;
  /**
   * bbox is used to determine the area background vector tiles are downloaded and prepared for.
   */
  bbox?: GeoJSON.BBox;
  /**
   * Initial map center
   */
  center?: [number, number];
  /**
   * **NOT IMPLEMENTED** If defined only background vector tiles that intersect with the polygon are included in the PWA.
   */
  //polygon?: GeoJSON.Polygon;
  /**
   * Configuration object for all data layers in the app
   */
  geometryConfig: { [layerName: string]: GeometryConfig };
  dataTileConfig?: DataTileConfig;
};

export type GeometryConfig = {
  /**
   * String that is used as layer display name in feature info
   */
  displayName?: string;
  /**
   * Order properties are shown in feature info. Array of strings with property field names.
   */
  order?: string[];
  /**
   * Path to the source file relative to the ./pwa_config directory.
   */
  path: string;
  /**
   * Propertie used as unique ID for all geometries of the source
   */
  ID: string;
  /**
   * Object resolving property field names (keys) to labels (values) as they are supposed to be shown in feature info
   */
  labels?: { [fieldName: string]: string };
  /**
   * Value mappings for values. First level are property field names (keys) and value mapping objects (values).
   * Second level are raw data values (keys) and resolved/"human readable" data values (values)
   */
  mappings?: { [fieldName: string]: { [value: string]: string } };
  /**
   * Configuration of the MlGeoJsonLayer component that is used to draw the highlight geometry on the map
   */
  highlightGeometry?: MlGeoJsonLayerProps;
  paint?: any;
  type: any;
  minzoom?: number;
  maxzoom?: number;
};

export type DataTileConfig = {
  sourceOptions: SourceOptions;
  insertBeforeLayer: string;
  layers: LayerConfig[];
};

export type LayerConfig = {
  id: string;
  type: any;
  source?: string;
  "source-layer"?: string;
  minzoom?: number;
  maxzoom?: number;
  filter?: any[];
  layout?: any;
  paint?: any;
};

export type SourceOptions = {
  type: "vector";
  url?: string;
  tiles?: string[];
  bounds?: [number, number, number, number];
  scheme?: "xyz" | "tms";
  minzoom?: number;
  maxzoom?: number;
  attribution?: string;
};
