interface Bounds {
    sw: { latitude: number; longitude: number }; // Southwest corner
    ne: { latitude: number; longitude: number }; // Northeast corner
}
  
interface Marker {
    name: string,
    pixelX: number,
    pixelY: number
}

interface Coords {
    lat: number,
    long: number
}

const convertLatLng = (
    markers: Marker[],
    imageWidth: number,
    imageHeight: number,
    bounds: Bounds
    ): { [key: string]: Coords } => {
        const { sw, ne } = bounds;

        const latitudeRange = ne.latitude - sw.latitude; // Total latitude range
        const longitudeRange = ne.longitude - sw.longitude; // Total longitude range

        const markerCoords: { [key: string]: Coords } = {}

        for (let mark of markers){
            // Latitude calculation (Y-axis is inverted: top-left is 0, increasing downward)
            const latitude = sw.latitude + ((imageHeight - mark.pixelY) / imageHeight) * latitudeRange;

            // Longitude calculation (X-axis increases to the right)
            const longitude = sw.longitude + (mark.pixelX / imageWidth) * longitudeRange;

            markerCoords[mark.name] =  {
                lat: latitude,
                long: longitude,
            };

        };
        return markerCoords;    
    };

  
  
const imageBounds: Bounds = {
    sw: { latitude: 0, longitude: 0 }, // Southwest corner
    ne: { latitude: 0.0008, longitude: 0.0008 }, // Northeast corner
};

const imgWidth = 3000; // Image width in pixels
const imgHeight = 3000; // Image height in pixels

const gymMarkers: Marker[] = [
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
  
const markerCoordinates = convertLatLng(gymMarkers, imgWidth, imgHeight, imageBounds);

for (let key in markerCoordinates) {
    const { lat, long } = markerCoordinates[key];
    console.log(`Exercise: ${key}, latitude: ${lat}, longitude: ${long}`)
}
  
  