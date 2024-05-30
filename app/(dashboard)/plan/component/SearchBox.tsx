"use client"
import { useState, useContext } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { FiSearch } from "react-icons/fi";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import { IoCarSport } from "react-icons/io5";
import { useThemeContext } from "@/providers/ThemeProvider";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TbCarSuv } from "react-icons/tb";
const SearchBox = () => {
    const { theme, setTheme } = useThemeContext()
    // @ts-ignore
    const { source, setSource } = useContext(SourceContext);
    // @ts-ignore
    const { destination, setDestination } = useContext(DestinationContext);
    const [value, setValue] = useState(null)
    const [value2, setValue2] = useState(null)
    const getLatandLng = (place: { value: { place_id: any; }; }, type: string) => {
        if (place) {
            const placeId = place.value.place_id;
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            service.getDetails({ placeId }, (place, status) => {
                if (status === "OK" && place?.geometry && place.geometry.location) {
                    if (type == "source") {
                        setSource({
                            lat: place?.geometry.location.lat(),
                            lng: place?.geometry.location.lng(),
                            name: place?.formatted_address,
                            label: place?.name
                        })
                    }
                    else {
                        setDestination({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                            name: place.formatted_address,
                            label: place.name
                        })
                    }
                }
            })
        }
        else {
            if (type == "source") {
                setSource(null);
            } else {
                setDestination(null);
            }
        }
    }
    return (
        <div className="flex flex-col w-full gap-2 p-2">
            <div className="flex flex-col w-full gap-3 p-4 bg-white dark:bg-navy-900 rounded-xl shadow">
                <h1 className="text-xl w-full text-center font-bold text-gray-700 dark:text-gray-300 text-nowrap cursor-default">
                    Nhập để tìm kiếm địa điểm cho lộ trình
                </h1>

                <div className="flex items-center rounded-full border-2 border-gray-300 dark:border-gray-500 bg-white text-navy-700 dark:bg-navy-900 dark:text-white w-full h-10">
                    <p className="pl-5 pr-2 text-xl">
                        <IoCarSport className="h-4 w-4 text-gray-400" />
                    </p>
                    <GooglePlacesAutocomplete
                        selectProps={{
                            id: "orderAddress",
                            onChange: (place: any) => {
                                setValue(place)
                                getLatandLng(place, "source");
                            },
                            value: value,
                            placeholder: "Địa điểm xuất phát...",
                            isClearable: true,
                            className: `peer h-10 self-center w-full rounded text-left pr-1 pt-[1.5px]`,
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
                                    color: theme == "dark" ? "#a0aec0" : "#a0aec0",
                                    fontSize: "0.875rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: theme == "dark" ? "#a0aec0" : "#a0aec0",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }),
                                clearIndicator: (provided) => ({
                                    ...provided,
                                    color: theme === "dark" ? "#D1D5DB" : "#374151",
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    backgroundColor: "transparent",
                                    color: theme === "dark" ? "#D1D5DB" : "#374151",
                                    marginTop: "2px"
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: theme === "dark" ? "#0B1437" : "#FFFFFF",
                                }),
                                menuList: (provided) => ({
                                    ...provided,
                                    backgroundColor: "transparent",
                                    color: theme === "dark" ? "#ffffff" : "#374151",
                                    marginTop: "2px",
                                }),
                                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                    return {
                                        ...styles,
                                        backgroundColor: isFocused ? (theme === "dark" ? '#707EAE' : "#d1d5db") : "transparent",
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

                <div className="flex items-center rounded-full border-2 border-gray-300 dark:border-gray-500 bg-white text-navy-700 dark:bg-navy-900 dark:text-white w-full h-10">
                    <p className="pl-5 pr-2 text-xl">
                        <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    </p>
                    <GooglePlacesAutocomplete
                        selectProps={{
                            id: "orderAddress",
                            onChange: (place: any) => {
                                setValue2(place)
                                getLatandLng(place, "destination");
                            },
                            value: value2,
                            placeholder: "Địa điểm đến...",
                            isClearable: true,
                            className: `peer h-10 self-center w-full rounded text-left pr-1 pt-[1.5px]`,
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
                                    color: theme == "dark" ? "#a0aec0" : "#a0aec0",
                                    fontSize: "0.875rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: theme == "dark" ? "#a0aec0" : "#a0aec0",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }),
                                clearIndicator: (provided) => ({
                                    ...provided,
                                    color: theme === "dark" ? "#D1D5DB" : "#374151",
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    backgroundColor: "transparent",
                                    color: theme === "dark" ? "#D1D5DB" : "#374151",
                                    marginTop: "2px"
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: theme === "dark" ? "#0B1437" : "#FFFFFF",
                                }),
                                menuList: (provided) => ({
                                    ...provided,
                                    backgroundColor: "transparent",
                                    color: theme === "dark" ? "#ffffff" : "#374151",
                                    marginTop: "2px",
                                }),
                                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                    return {
                                        ...styles,
                                        backgroundColor: isFocused ? (theme === "dark" ? '#707EAE' : "#d1d5db") : "transparent",
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

        </div>
    );
}

export default SearchBox;