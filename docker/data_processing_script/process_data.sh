#!/bin/bash

set -x

files_to_check=(
#"adressen.geojson"
#"armatur_real.geojson"
)


# until scripts/deleteSuperfluousFiles.js is checked in
CONTAINER_COMMAND="node ./scripts/updateBackgroundTiles.js && node ./scripts/generateDataVectorTiles.js && node ./scripts/generateGeometryIndex.js || echo 'Failed to update data.'"


OUTPUT_DIRECTORY=app_data
SOURCE=/pwadata/


# prepare filesystem folders
rm -r ${OUTPUT_DIRECTORY}
rm -r build
mkdir -p ${OUTPUT_DIRECTORY}/geojson
mkdir ${OUTPUT_DIRECTORY}/search
mkdir ${OUTPUT_DIRECTORY}/data_tiles
mkdir ${OUTPUT_DIRECTORY}/background_tiles

cd docker/data_processing_container
cp -r ../../pwa_config ./
docker build -t mc_pwa_data_processing ./
rm -rf ./pwa_config
cd ../..
docker run --user $(id -u):$(id -g) -t --rm -v ${PWD}/${OUTPUT_DIRECTORY}/:/app_data/:rw mc_pwa_data_processing bash -c "ls -al /app_data && $CONTAINER_COMMAND"


rm -rf public/app_data
rm -rf app_data/background_tiles/8
rm -rf app_data/background_tiles/9
rm -rf app_data/background_tiles/10
rm -rf app_data/background_tiles/11
rm -rf app_data/background_tiles/12
rm -rf app_data/background_tiles/13
rm -rf app_data/background_tiles/14
cp -r pwa_config/data app_data/geojson/
cp -r app_data public/
