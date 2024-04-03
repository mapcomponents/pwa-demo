import * as fs from "fs";

const geoJsonSources = ["tramhalte_point.json"];

async function createSearchIndex() {
  const elasticlunr = await import("elasticlunr");

  const searchIndex = elasticlunr.default(function () {
    this.setRef("ID");
    this.addField("HALTESTELLE");
    this.saveDocument(true);
  });

  const processData = (source) => {
    const data = fs.readFileSync(`./${source}`, "utf8");
    const raw = JSON.parse(data);

    const features = raw.features.map((feature) => {
      return {
        ID: feature.id,
        HALTESTELLE: feature.properties.Naam,
        COORDINATES: feature.geometry.coordinates,
        source: source,
      };
    });

    features.forEach((feature) => {
      searchIndex.addDoc(feature);
    });
  };

  await Promise.all(geoJsonSources.map(processData));

  fs.writeFileSync("./searchIndex.json", JSON.stringify(searchIndex));
  console.log("Search index generated.");
}

createSearchIndex().catch(console.error);
