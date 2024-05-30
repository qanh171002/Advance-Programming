'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, OverlayViewF, useJsApiLoader } from '@react-google-maps/api';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdOutlineMyLocation } from 'react-icons/md';
import { Button } from '@nextui-org/react';
import { useThemeContext } from '@/providers/ThemeProvider';
import { CollapseContext } from '../context/CollapseContext';
import { DestinationContext } from '../context/DestinationContext';
import { SourceContext } from '../context/SourceContext';
import Notification from '@/components/notification'
import { DistanceContext } from '../context/DistanceContext';
import darkTheme from '../maptheme/dark.json';
import lightTheme from '../maptheme/light.json';

function MapExport() {
    const { theme, setTheme } = useThemeContext()
    const [map, setMap] = React.useState<google.maps.Map | null>(null);
    // @ts-ignore
    const { isCollapsed, setIsCollapsed } = useContext(CollapseContext);
    // @ts-ignore
    const { source, setSource } = useContext(SourceContext);
    // @ts-ignore
    const { distance, setDistance } = useContext(DistanceContext);
    // @ts-ignore
    const { destination, setDestination } = useContext(DestinationContext);
    const [openModal, setOpenModal] = useState(false)
    const [message, setMessage] = useState("")
    const [directionRoutePoints, setdirectionRoutePoints] = useState<google.maps.DirectionsResult>();
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

    const directionRoute = () => {
        if (directionRoutePoints?.routes[0]) {
            // @ts-ignore
            directionRoutePoints.routes[0] = null
        }
        if (source != null && destination != null) {
            let DirectionsService = new google.maps.DirectionsService();
            DirectionsService.route({
                origin: { lat: source?.lat, lng: source?.lng },
                destination: { lat: destination?.lat, lng: destination?.lng },
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result: any, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setIsCollapsed(true)
                    setdirectionRoutePoints(result);
                    let totalDistance = 0;
                    result.routes[0].legs?.forEach((leg: any) => {
                        totalDistance += leg.distance.value;
                    });
                    const kmDistance = (totalDistance / 1000).toFixed(2);
                    setDistance(kmDistance);
                } else {
                    setMessage("Không thể tìm thấy tuyến đường, vui lòng chọn lại.")
                    setOpenModal(true)
                }
            });
        }
    };

    useEffect(() => {
        directionRoute();
    }, [source, destination]);

    useEffect(() => {
        if (map && source && !destination) {
            const projection = map.getProjection();
            if (projection) {
                const getNewLng = (point: any, offsetX: any) => {
                    const sourcePixel = projection.fromLatLngToPoint(point);
                    // @ts-ignore
                    return projection.fromPointToLatLng({ x: sourcePixel.x - offsetX * (1 / Math.pow(2, map.getZoom())), y: sourcePixel.y }).lng();
                };

                map.setZoom(12);
                map.panTo({
                    lat: source.lat,
                    lng: getNewLng(source, !isCollapsed ? 250 : 0),
                });
            }
        }
    }, [source, isCollapsed]);

    useEffect(() => {
        if (map && destination && !source) {
            const projection = map.getProjection();
            if (projection) {
                const getNewLng = (point: any, offsetX: any) => {
                    const sourcePixel = projection.fromLatLngToPoint(point);
                    // @ts-ignore
                    return projection.fromPointToLatLng({ x: sourcePixel.x - offsetX * (1 / Math.pow(2, map.getZoom())), y: sourcePixel.y }).lng();
                };

                map.setZoom(12);
                map.panTo({
                    lat: destination.lat,
                    lng: getNewLng(destination, !isCollapsed ? 250 : 0),
                });
            }
        }
    }, [destination, isCollapsed]);

    useEffect(() => {
        if (directionRoutePoints?.routes[0]) {
            // @ts-ignore
            directionRoutePoints.routes[0] = null
        }
        if (source != null && destination != null) {
            let DirectionsService = new google.maps.DirectionsService();
            DirectionsService.route({
                origin: { lat: source?.lat, lng: source?.lng },
                destination: { lat: destination?.lat, lng: destination?.lng },
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result: any, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setIsCollapsed(true)
                    setdirectionRoutePoints(result);
                    let totalDistance = 0;
                    result.routes[0].legs?.forEach((leg: any) => {
                        totalDistance += leg.distance.value;
                    });
                    const kmDistance = (totalDistance / 1000).toFixed(2);
                    setDistance(kmDistance);
                } else {
                    setMessage("Không thể tìm thấy tuyến đường, vui lòng chọn lại.")
                    setOpenModal(true)
                }
            });
        }
    }, [theme]);

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

    const handleMyLocation = useCallback(() => {
        setIsCollapsed(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (map) {
                    map.setCenter(userLocation);
                    map.setZoom(14)
                }
            }, error => {
                setMessage("Vui lòng cho phép trình duyệt quyền truy cập vị trí để sử dụng tính năng này.")
                setOpenModal(true)
            });
        } else {
            setMessage("Vui lòng cho phép trình duyệt quyền truy cập vị trí để sử dụng tính năng này.")
            setOpenModal(true)
        }
    }, [map]);

    const onLoad = useCallback(function callback(mapInstance: any) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    return <GoogleMap
        mapContainerStyle={containerStyle}
        options={mapOptions}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
    >
        {source && (
            <MarkerF
                position={source}
                icon={{
                    url: theme == "dark" ? "/img/placeholder/placeHolder3.png" : "/img/placeholder/placeHolder2.png",
                    // @ts-ignore
                    scaledSize: { equals: null, width: theme == "dark" ? 45 : 50, height: theme == "dark" ? 45 : 50 },
                }}
                className="relative shadow"
            >
                <OverlayViewF
                    position={source}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className="absolute top-2 right-0 translate-x-1/2 p-2 text-[#1488D8] dark:bg-navy-900 dark:text-gray-300 bg-white border-[#1488D8] border-2 dark:border-gray-300
                    transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 shadow-xl rounded-xl font-semibold text-xs truncate max-w-10">
                        <p>{source.label}</p>
                    </div>
                </OverlayViewF>
            </MarkerF>
        )}
        {destination && (
            <MarkerF
                position={destination}
                icon={{
                    url: theme == "dark" ? "/img/placeholder/placeHolder4.png" : "/img/placeholder/placeHolder.png",
                    // @ts-ignore
                    scaledSize: { equals: null, width: 45, height: 45 },
                }}
                className="relative shadow"
            >
                <OverlayViewF
                    position={destination}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className="absolute top-2 right-0 translate-x-1/2 p-2 text-[#1488D8] dark:bg-navy-900 dark:text-gray-300 bg-white border-[#1488D8] border-2 dark:border-gray-300
                    transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 shadow-xl rounded-xl font-semibold text-xs truncate max-w-10">
                        <p>{destination.label}</p>
                        <p className="text-center underline">{distance} km</p>
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
        <div className="absolute bottom-5 right-1/2 translate-x-1/2 sm:bottom-1/2 sm:translate-y-1/2 sm:right-5 sm:translate-x-0 flex sm:flex-col gap-1 items-center">
            <Button
                className="linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-white text-[#1488DB] border-2 border-[#1488DB] dark:border-white transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 w-8 h-8 shadow-xl"
                onClick={zoomIn}
            >
                <FiZoomIn />
            </Button>
            <Button
                className="w-12 h-12 linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-white text-[#1488DB] border-2 border-[#1488DB] dark:border-white transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 shadow-xl"
                onClick={handleMyLocation}
            >
                <MdOutlineMyLocation className="w-8 h-8" />
            </Button>
            <Button
                className="linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-white text-[#1488DB] border-2 border-[#1488DB] dark:border-white transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 w-8 h-8 shadow-xl"
                onClick={zoomOut}
            >
                <FiZoomOut />
            </Button>
        </div>
        {openModal && <Notification onClose={() => setOpenModal(false)} message={message} />}
    </GoogleMap>
}

export default React.memo(MapExport);
