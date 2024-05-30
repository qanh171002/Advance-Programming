export function getGeocode(lat: number, lng: number) {
    return new Promise((resolve, reject) => {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({ location: latlng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results && results[0]) {
                    // Resolve with the formatted address
                    resolve(results[0].formatted_address);
                } else {
                    console.error("No results found");
                    resolve("");
                }
            } else {
                console.error("Geocoder failed due to: " + status);
                resolve("");
            }
        });
    });
}