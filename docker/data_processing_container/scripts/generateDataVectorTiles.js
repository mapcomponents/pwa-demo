const { exec } = require("child_process");
const pwaConfig = require("../pwa_config/config.json");

// Function to construct the tippecanoe command
function constructTippecanoeCommand(files, properties) {
  const basePath = "../pwa_config/";
  const filePaths = files.map((file) => `${basePath}/${file}`).join(" ");
  const includeProperties = properties
    .map((prop) => `--include ${prop}`)
    .join(" ");

  return `tippecanoe -r1 -z 15 -o /app_data/data_tiles/dataTiles.mbtiles ${includeProperties} --no-tile-size-limit --no-feature-limit --detect-shared-borders --no-line-simplification --no-simplification-of-shared-nodes --no-tiny-polygon-reduction ${filePaths}`;
}

// Extract files and properties from the config
let files = [];
let properties = [];
for (const [key, value] of Object.entries(pwaConfig.geometryConfig)) {
  files.push(value.path);
  if (value.propertiesTiles) {
    properties = [...properties, ...value.propertiesTiles];
  }
}

// Ensure properties are unique
properties = [...new Set(properties)];

const command = constructTippecanoeCommand(files, properties);

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
