const fs = require("fs").promises;
const path = require("path");
const pwaConfigPath = path.join(__dirname, "../pwa_config/config.json");

function addDataToGeometryIndex(geometryIndex, data, source, idField) {
  console.log(`Adding data for source: ${source}, ID field: ${idField}`);
  data.features.forEach((feature) => {
    const idValue = feature.properties[idField] || feature.id;
    if (idValue) {
      geometryIndex[idValue] = { source: path.basename(source) };
    }
  });
}

async function processGeoJSONFiles() {
  let geometryIndex = {};
  const pwaConfig = require(pwaConfigPath);

  for (const [sourceKey, config] of Object.entries(pwaConfig.geometryConfig)) {
    const filePath = path.join(path.dirname(pwaConfigPath), config.path);
    console.log(`Processing file: ${filePath}`);

    try {
      const data = await fs.readFile(filePath, "utf8");
      const geojsonData = JSON.parse(data);
      await addDataToGeometryIndex(
        geometryIndex,
        geojsonData,
        config.path,
        config.ID
      );
    } catch (error) {
      console.error(`Error processing ${sourceKey}:`, error);
      return;
    }
  }

  return geometryIndex;
}

async function loadGeojson() {
  try {
    const finalGeometryIndex = await processGeoJSONFiles();
    console.log(
      "Final Geometry Index:",
      JSON.stringify(finalGeometryIndex, null, 2)
    );

    const outputPath = "./app_data/search/geometryIndex.json";
    await fs.writeFile(
      outputPath,
      JSON.stringify(finalGeometryIndex, null, 2),
      "utf8"
    );
    console.log("Geometry index successfully created.");
  } catch (err) {
    console.error("Failed to create geometry index:", err);
  }
}

loadGeojson();
