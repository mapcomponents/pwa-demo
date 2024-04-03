var tilebelt = require("@mapbox/tilebelt");
const request = require("request-promise-native");
const fs = require("fs");
const path = require("path");
const turf = require("@turf/turf");
const sqlite3 = require("sqlite3").verbose();
const pwaConfig = require("../pwa_config/config.json");
var tiles_downloaded = [];
var targetFolder = "/app_data/background_tiles/";

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const downloadTile = async (tile) => {
  let currentTile = tile[2] + "/" + tile[0] + "/" + tile[1];
  ensureDirectoryExistence(targetFolder + currentTile);
  tiles_downloaded.push(tile);

  const res = await request.get(
    "https://wms.wheregroup.com/tileserver/tile/tileserver.php?/europe-0-14.json?/europe-0-14/" +
      currentTile +
      ".pbf",
    {
      gzip: true,
      resolveWithFullResponse: true,
      encoding: null,
    }
  );

  await fs.writeFile(
    targetFolder + currentTile + ".pbf",
    res.body,
    function (err) {
      if (err) {
        return console.log(err);
      }
      // console.log("done: " + currentTile);
    }
  );
};

const downloadTiles = async () => {
  //let bbox = [
  //  //13.03481451170515, 52.687267036547695, 13.862493542340758, 52.28676437009736,
  //  12.828598,
  //  52.288323, 14.136658, 52.6922,
  //];
  let bbox = pwaConfig.bbox;
  let bboxPolygon = turf.bboxPolygon(bbox);
  console.log(bboxPolygon);

  console.log(tilebelt.bboxToTile(bbox));
  let [tile_x, tile_y, tile_z] = tilebelt.bboxToTile(bbox);
  let tiles_to_download = [[tile_x, tile_y, tile_z]];

  const MAX_LEVEL = 14;
  for (let level = tile_z; level <= MAX_LEVEL; ++level) {
    console.log(
      `Download ${tiles_to_download.length} tiles for level ${level}`
    );
    let new_level = [];
    let tilesDownloaded = 0;
    for (let tile of tiles_to_download) {
      if (
        turf.intersect(turf.bboxPolygon(tilebelt.tileToBBOX(tile)), bboxPolygon)
      ) {
        tilesDownloaded++;
        await downloadTile(tile);
      }
      if (level < MAX_LEVEL) {
        new_level.push(...tilebelt.getChildren(tile));
      }
    }
    console.log(`Downloaded ${tilesDownloaded} tiles for level ${level}`);
    tiles_to_download = new_level;
  }
};

const createMbtiles = () => {
  // Set the name of the output MBTiles file
  const mbtilesFile = targetFolder + "background.mbtiles";

  // Create a new SQLite database
  const db = new sqlite3.Database(mbtilesFile);

  // Create the metadata and tiles tables
  db.serialize(() => {
    // Delete the tables if they already exist
    db.run("DROP TABLE IF EXISTS metadata");
    db.run("DROP TABLE IF EXISTS tiles");

    db.run("CREATE TABLE metadata (name TEXT, value TEXT)");
    db.run(
      "CREATE TABLE tiles (zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB)"
    );

    // Insert metadata into the metadata table
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "name",
      "background tiles",
    ]);
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "type",
      "background",
    ]);
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "version",
      "0x03",
    ]);
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "center",
      "13.320923,52.499504,10",
    ]);
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "minzoom",
      "0",
    ]);
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "maxzoom",
      "10",
    ]);
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "description",
      "OSM data Vectortiles - OpenMapTiles",
    ]);
    db.run("INSERT INTO metadata (name, value) VALUES (?, ?)", [
      "format",
      "pbf",
    ]);
  });

  // Recursively read the vector tiles from the file system and insert them into the database
  function readTiles(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        readTiles(filePath);
      } else {
        // console.log(filePath);
        const [z, x, y] = filePath
          .replace(targetFolder, "")
          .replace(".pbf", "")
          .split(path.sep)
          .map(Number);
        // console.log(z, x, y);
        // console.log(typeof z, typeof x, typeof y);
        const data = fs.readFileSync(filePath);
        if (data && z && x && y) {
          db.run(
            "INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_data) VALUES (?, ?, ?, ?)",
            [z, x, Math.pow(2, parseInt(z)) - parseInt(y) - 1, data]
          );
        }
      }
    });
  }

  readTiles(targetFolder);

  // Close the database
  db.close();
};

(async () => {
  await downloadTiles();
  createMbtiles();
})();
