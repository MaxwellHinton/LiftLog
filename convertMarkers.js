var convertLatLng = function (markers, imageWidth, imageHeight, bounds) {
    var sw = bounds.sw, ne = bounds.ne;
    var latitudeRange = ne.latitude - sw.latitude; // Total latitude range
    var longitudeRange = ne.longitude - sw.longitude; // Total longitude range
    var markerCoords = {};
    for (var _i = 0, markers_1 = markers; _i < markers_1.length; _i++) {
        var mark = markers_1[_i];
        // Latitude calculation (Y-axis is inverted: top-left is 0, increasing downward)
        var latitude = sw.latitude + ((imageHeight - mark.pixelY) / imageHeight) * latitudeRange;
        // Longitude calculation (X-axis increases to the right)
        var longitude = sw.longitude + (mark.pixelX / imageWidth) * longitudeRange;
        markerCoords[mark.name] = {
            lat: latitude,
            long: longitude,
        };
    }
    ;
    return markerCoords;
};
var imageBounds = {
    sw: { latitude: 0, longitude: 0 }, // Southwest corner
    ne: { latitude: 0.0008, longitude: 0.0008 }, // Northeast corner
};
var imgWidth = 3000; // Image width in pixels
var imgHeight = 3000; // Image height in pixels
var gymMarkers = [
    {
        name: "Bench Press",
        pixelX: 742,
        pixelY: 2613,
    },
    {
        name: "Cardio Machines",
        pixelX: 742,
        pixelY: 1395,
    },
    {
        name: "Barbell Bent over Rows",
        pixelX: 2442,
        pixelY: 1634,
    },
    {
        name: "Pull ups",
        pixelX: 2442,
        pixelY: 2613,
    },
    {
        name: "Preacher curls",
        pixelX: 2442,
        pixelY: 615,
    },
];
var markerCoordinates = convertLatLng(gymMarkers, imgWidth, imgHeight, imageBounds);
for (var key in markerCoordinates) {
    var _a = markerCoordinates[key], lat = _a.lat, long = _a.long;
    console.log("Exercise: ".concat(key, ", latitude: ").concat(lat, ", longitude: ").concat(long));
}
