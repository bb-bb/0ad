RMS.LoadLibrary("rmgen");

log("Initializing map...");

InitMap();

// TODO scenario

placeObject(Math.round(fractionToTiles(0.5)), Math.round(fractionToTiles(0.95)), "special/trigger_point_A", 0, PI);
placeObject(Math.round(fractionToTiles(0.5)), Math.round(fractionToTiles(0.05)), "special/trigger_point_B", 0, PI);
placeObject(Math.round(fractionToTiles(0.5)), Math.round(fractionToTiles(0.5)), "special/trigger_point_C", 0, PI);

ExportMap();

