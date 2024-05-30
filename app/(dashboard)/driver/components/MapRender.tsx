'use client'
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, OverlayViewF, useJsApiLoader } from '@react-google-maps/api';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdOutlineMyLocation } from 'react-icons/md';
import { Button } from '@nextui-org/react';
import { useThemeContext } from '@/providers/ThemeProvider';
import Notification from '@/components/notification'
import darkTheme from '@/app/(dashboard)/plan/maptheme/dark.json'
import lightTheme from '@/app/(dashboard)/plan/maptheme/light.json'
import { getGeocode } from '@/app/components/GetLocationAddress';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { getCoordinates } from '@/app/components/GetCoordinates';
import { FaMapMarkerAlt } from 'react-icons/fa';
interface sourceProps {
    lat: number,
    lng: number,
    label: string,
    name: string
}
interface MapProps {
    source: sourceProps,
    setSource: Dispatch<SetStateAction<sourceProps>>
}
const MapExport: React.FC<MapProps> = ({ source, setSource }) => {
    const { theme, setTheme } = useThemeContext()
    const [map, setMap] = React.useState<google.maps.Map | null>(null);
    const [message, setMessage] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const containerStyle = {
        width: '100%',
        height: '100%',
    };
    const [valueSearchBox, setValueSearchBox] = useState();
    const mapOptions = {
        disableDefaultUI: true,
        minZoom: 4,
        maxZoom: 18,
        styles: theme == "dark" ? darkTheme : lightTheme,

    };

    const [center, setCenter] = useState({
        lat: source.lat,
        lng: source.lng,
    });

    useEffect(() => {
        if (map && source) {
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
                    lng: getNewLng(source, 0),
                });
            }
        }
    }, [source.lat, source.lng]);

    const handleMapClick = (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        getGeocode(lat, lng)
            .then((address: any) => {
                setSource({ name: address, label: address, lat, lng });
            })
            .catch((error) => {
                console.error("Đã xảy ra lỗi khi lấy thông tin chi tiết về vị trí:", error);
            });
    };

    const handleSearch = (place: any) => {
        if (place && place?.label) {
            getCoordinates(place.label)
                .then((coordinates: any) => {
                    if (coordinates) {
                        setSource((rest) => ({
                            label: place.label,
                            name: place.label,
                            lat: coordinates.lat,
                            lng: coordinates.lng,
                        }));
                    }
                })
                .catch((error) => {
                    console.error("Đã xảy ra lỗi khi tìm kiếm tọa độ:", error);
                });
        }
    };

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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                if (map) {
                    getGeocode(position.coords.latitude, position.coords.longitude)
                        .then((address: any) => {
                            setSource({ name: address, label: address, lat: position.coords.latitude, lng: position.coords.longitude });
                        })
                        .catch((error) => {
                            console.error("Đã xảy ra lỗi khi tìm kiếm tọa độ:", error);
                        });
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
        onClick={handleMapClick}
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
        <div className="absolute top-3 left-3 w-[calc(100%-80px)] sm:w-1/2 self-start">
            <div className="flex items-center rounded-full border-2 border-[#1488D8] dark:border-gray-300 bg-white text-navy-700 dark:bg-navy-900 dark:text-white w-full h-10">
                <p className="pl-5 pr-2 text-xl">
                    <FaMapMarkerAlt className="h-4 w-4 text-[#1488D8] dark:text-gray-300" />
                </p>
                <GooglePlacesAutocomplete
                    selectProps={{
                        id: "orderAddress",
                        onChange: (place: any) => {
                            setValueSearchBox(place)
                            handleSearch(place);
                        },
                        value: valueSearchBox,
                        placeholder: "Tìm kiếm...",
                        isClearable: true,
                        className: `peer h-10 self-center w-full rounded text-left pr-1 pt-[1px]`,
                        components: {
                            // @ts-ignore
                            DropdownIndicator: false,
                            // @ts-ignore
                            LoadingIndicator: false
                        },
                        styles: {
                            control: (provided, state) => ({
                                ...provided,
                                backgroundColor: "transparent",
                                border: "none",
                                boxShadow: state.isFocused ? "none" : provided.boxShadow,
                                "&:hover": {
                                    border: "none",
                                },
                                color: "#4a5568",
                            }),
                            placeholder: (provided) => ({
                                ...provided,
                                color: theme == "dark" ? "#a0aec0" : "#1488D8",
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }),
                            input: (provided) => ({
                                ...provided,
                                color: theme === "dark" ? "#D1D5DB" : "#1488D8",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }),
                            clearIndicator: (provided) => ({
                                ...provided,
                                color: theme === "dark" ? "#D1D5DB" : "#1488D8",
                            }),
                            singleValue: (provided) => ({
                                ...provided,
                                backgroundColor: "transparent",
                                color: theme === "dark" ? "#D1D5DB" : "#1488D8",
                                marginTop: "2px"
                            }),
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: theme === "dark" ? "#0B1437" : "#FFFFFF",
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                backgroundColor: "transparent",
                                color: theme === "dark" ? "#ffffff" : "#1488D8",
                                marginTop: "2px",
                            }),
                            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                return {
                                    ...styles,
                                    backgroundColor: isFocused ? (theme === "dark" ? '#707EAE' : "#e8eaed") : "transparent",
                                }
                            },
                            container: (provided, state) => ({
                                ...provided,
                                color: "#4a5568",
                            }),
                        },
                    }}
                />
            </div>
        </div>
        <div className="absolute bottom-[4.5rem] right-1/2 translate-x-1/2 sm:bottom-1/2 sm:translate-y-1/2 sm:right-5 sm:translate-x-0 flex sm:flex-col gap-1 items-center">
            <Button
                className="linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-gray-200 text-[#1488DB] border-2 border-[#1488DB] dark:border-gray-200 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 w-8 h-8 shadow-xl"
                onClick={zoomIn}
            >
                <FiZoomIn />
            </Button>
            <Button
                className="w-12 h-12 linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-gray-200 text-[#1488DB] border-2 border-[#1488DB] dark:border-gray-200 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 shadow-xl"
                onClick={handleMyLocation}
            >
                <MdOutlineMyLocation className="w-8 h-8" />
            </Button>
            <Button
                className="linear mt-1 flex items-center justify-center gap-2 rounded-full bg-white p-2 dark:text-gray-200 text-[#1488DB] border-2 border-[#1488DB] dark:border-gray-200 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-800 dark:hover:opacity-90 dark:active:opacity-80 w-8 h-8 shadow-xl"
                onClick={zoomOut}
            >
                <FiZoomOut />
            </Button>
        </div>
        {openModal && <Notification onClose={() => setOpenModal(false)} message={message} />}
    </GoogleMap>
}

export default React.memo(MapExport);