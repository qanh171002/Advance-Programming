'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, OverlayViewF } from '@react-google-maps/api';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdOutlineMyLocation } from 'react-icons/md';
import { Button } from '@nextui-org/react';
import { useThemeContext } from '@/providers/ThemeProvider';
import Notification from '@/components/notification'
import darkTheme from '@/app/(dashboard)/plan/maptheme/dark.json';
import lightTheme from '@/app/(dashboard)/plan/maptheme/light.json';
import { Address } from '@/library/libraryType/type';
interface MapProps {
    source: Address,
    destination: Address,
    progress: number
}
function MapExport({ source, destination, progress }: MapProps) {
    const { theme, setTheme } = useThemeContext()
    const [map, setMap] = React.useState<google.maps.Map | null>(null);
    const [openModal, setOpenModal] = useState(false)
    const [message, setMessage] = useState("")
    const [directionRoutePoints, setdirectionRoutePoints] = useState<google.maps.DirectionsResult | undefined>();
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
    const containerStyle = {
        width: '100%',
        height: '100%',
    };

    const mapOptions = {
        disableDefaultUI: true,
        minZoom: 4,
        maxZoom: 18,
        styles: theme == "dark" ? darkTheme : lightTheme
    };

    const [center, setCenter] = useState({
        lat: 10.816360162758764,
        lng: 106.62860159222816,
    });

    const zoomIn = useCallback(() => {
        if (map) {
            const currentZoom = map.getZoom();
            if (currentZoom !== undefined && currentZoom < 18) {
                map.setZoom(currentZoom + 1);
            }
        }
    }, [map]);

    const zoomOut = useCallback(() => {
        if (map) {
            const currentZoom = map.getZoom();
            if (currentZoom !== undefined && currentZoom > 4) {
                map.setZoom(currentZoom - 1);
            }
        }
    }, [map]);

    const onLoad = useCallback(function callback(mapInstance: any) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    useEffect(() => {
        // Cập nhật tuyến đường khi có sự thay đổi trong source, destination hoặc progress
        if (source && destination) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: { lat: source.latitude, lng: source.longitude },
                    destination: { lat: destination.latitude, lng: destination.longitude },
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setdirectionRoutePoints(result);
                    } else {
                        console.error(`Failed to get directions: ${status}`);
                    }
                }
            );
        }
    }, [source, destination, progress]);

    useEffect(() => {
        if (directionRoutePoints && progress >= 0 && progress <= 100) {
            const route = directionRoutePoints.routes[0];
            const legs = route?.legs;
            if (legs && legs.length > 0) {
                const totalDistance = legs[0].distance?.value ?? 0;
                const targetDistance = (progress / 100) * totalDistance;
                let accumulatedDistance = 0;
                let found = false;

                for (let i = 0; i < route.legs[0].steps.length; i++) {
                    const step = route.legs[0].steps[i];
                    const stepDistance = step.distance?.value ?? 0;

                    if (accumulatedDistance + stepDistance >= targetDistance) {
                        const ratio = (targetDistance - accumulatedDistance) / stepDistance;

                        const currentLocationLat = step.start_location?.lat() + (step.end_location?.lat() - step.start_location?.lat()) * ratio;
                        const currentLocationLng = step.start_location?.lng() + (step.end_location?.lng() - step.start_location?.lng()) * ratio;

                        setCurrentLocation(new google.maps.LatLng(currentLocationLat, currentLocationLng));
                        found = true;
                        break;
                    }

                    accumulatedDistance += stepDistance;
                }

                if (!found) {
                    const lastStep = route.legs[0].steps[route.legs[0].steps.length - 1];
                    setCurrentLocation(lastStep.end_location);
                }
            }
        }
    }, [directionRoutePoints, progress]);

    const handleMyLocation = useCallback(() => {
        if (currentLocation && map) {
            map.panTo(currentLocation);
            map.setZoom(12)
        }
    }, [currentLocation, map]);

    return <GoogleMap
        mapContainerStyle={containerStyle}
        options={mapOptions}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
    >
        {currentLocation && (
            <MarkerF position={currentLocation} icon={{
                url: theme == "dark" ? "/img/placeholder/placeHolder3.png" : "/img/placeholder/placeHolder2.png",
                // @ts-ignore
                scaledSize: { equals: null, width: 50, height: 50 },
            }} className="relative shadow" >
                <OverlayViewF
                    position={currentLocation}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className="absolute top-2 z-50 right-0 translate-x-1/2 p-2 text-[#1488D8] dark:bg-navy-900 dark:text-gray-300 bg-white border-[#1488D8] border-2 dark:border-gray-300
                    transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 shadow-xl rounded-xl font-semibold text-xs truncate max-w-10">
                        <p>Vị trí hiện tại</p>
                    </div>
                </OverlayViewF>
            </MarkerF>
        )}
        {source && (

            <OverlayViewF
                position={{ lat: source.latitude, lng: source.longitude }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div className="absolute z-20 -top-2 right-0 translate-x-1/2 p-2 text-[#1488D8] dark:bg-navy-900 dark:text-gray-300 bg-white border-[#1488D8] border-2 dark:border-gray-300
                    transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 shadow-xl rounded-xl font-semibold text-xs truncate max-w-10">
                    <p>Điểm xuất phát</p>
                    <p>{source.address}</p>
                </div>
            </OverlayViewF>
        )}
        {destination && (
            <MarkerF
                position={{ lat: destination.latitude, lng: destination.longitude }}
                icon={{
                    url: theme == "dark" ? "/img/placeholder/placeHolder4.png" : "/img/placeholder/placeHolder.png",
                    // @ts-ignore
                    scaledSize: { equals: null, width: 45, height: 45 },
                }}
                className="relative shadow z-[25]"
            >
                <OverlayViewF
                    position={{ lat: destination.latitude, lng: destination.longitude }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className="absolute top-2 right-0 translate-x-1/2 p-2 text-[#1488D8] dark:bg-navy-900 dark:text-gray-300 bg-white border-[#1488D8] border-2 dark:border-gray-300
                    transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 shadow-xl rounded-xl font-semibold text-xs truncate max-w-10">
                        <p>Điểm đến</p>
                        <p>{destination.address}</p>
                    </div>
                </OverlayViewF>
            </MarkerF>
        )}

        {source && destination &&
            <DirectionsRenderer
                directions={directionRoutePoints}
                options={{
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: theme == "dark" ? "#0B1437" : "#1488DB",
                        strokeWeight: 5,
                    },
                }}
            />
        }
        <div className="absolute bottom-0 flex items-center w-full">
            <Button
                className="linear h-10 w-10 mt-1 flex items-center justify-center gap-2 bg-white p-2 dark:text-white 
                text-[#1488DB] dark:border-r dark:border-gray-800 transition duration-200 hover:cursor-pointer hover:bg-gray-100 
                active:bg-gray-200 dark:bg-navy-800 shadow-xl"
                onClick={zoomIn}
            >
                <FiZoomIn />
            </Button>
            <Button
                className="h-10 grow linear mt-1 flex items-center justify-center gap-2 bg-white p-2 dark:text-white text-[#1488DB] t
                ransition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800"
                onClick={handleMyLocation}
            >
                Xem vị trí hiện tại
            </Button>
            <Button
                className="linear h-10 w-10 mt-1 flex items-center justify-center gap-2 bg-white p-2 dark:text-white 
                text-[#1488DB] dark:border-r dark:border-gray-800  transition duration-200 hover:cursor-pointer hover:bg-gray-100 
                active:bg-gray-200 dark:bg-navy-800"
                onClick={zoomOut}
            >
                <FiZoomOut />
            </Button>
        </div>
        {openModal && <Notification onClose={() => setOpenModal(false)} message={message} />}
    </GoogleMap>
}

export default React.memo(MapExport);
