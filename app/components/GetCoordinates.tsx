interface Coordinates {
    lat: number;
    lng: number;
}

export function getCoordinates(address: string): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: address }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results && results[0]) {
                    const location = results[0].geometry.location;
                    const lat = location.lat();
                    const lng = location.lng();
                    resolve({ lat, lng });
                } else {
                    console.error("No results found");
                    resolve({ lat: 0, lng: 0 });
                }
            } else {
                console.error("Geocoder failed due to: " + status);
                resolve({ lat: 0, lng: 0 });
            }
        });
    });
}
