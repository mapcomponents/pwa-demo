var pathname =
  window.location.pathname[window.location.pathname.length - 1] === "/"
    ? window.location.pathname.substring(0, window.location.pathname.length - 1)
    : window.location.pathname;

var appUrl = window.location.origin + pathname;
var tileUrl =
  "mbtiles://app_data/background_tiles/background.mbtiles/{z}/{x}/{y}";

var dataUrl = "mbtiles://app_data/data_tiles/dataTiles.mbtiles/{z}/{x}/{y}";

export { appUrl, tileUrl, dataUrl };
