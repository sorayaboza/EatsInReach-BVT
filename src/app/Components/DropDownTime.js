import React, { useState, useEffect, useRef } from "react";

const DropdownTime = ({ setTime, setAmPm }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [amPmOpen, setAmPmOpen] = useState(false);
    const dropdownRef = useRef(null);
    const amPmDropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdownAmPm = () => {
        setAmPmOpen(!amPmOpen);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
            if (
                amPmDropdownRef.current && !amPmDropdownRef.current.contains(event.target)
            ) {
                setAmPmOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, amPmDropdownRef]);

    return (
        <div className="relative flex ">
            {/* Button for time dropdown */}
            <div ref={dropdownRef}>
                <button
                    onClick={(e) => { e.preventDefault(); toggleDropdown() }}

                    className="inline-flex w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    aria-expanded={isOpen}
                >
                    Time
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute left-0 mt-2 w-28 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            <ul>

                                <li onClick={(e) => { e.preventDefault(); setTime("1:00"); }}>1:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("2:00"); }}>2:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("3:00"); }}>3:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("4:00"); }}>4:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("5:00"); }}>5:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("6:00"); }}>6:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("7:00"); }}>7:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("8:00"); }}>8:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("9:00"); }}>9:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("10:00"); }}>10:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("11:00"); }}>11:00</li>
                                <li onClick={(e) => { e.preventDefault(); setTime("12:00"); }}>12:00</li>

                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Button for AM/PM dropdown */}
            <div ref={amPmDropdownRef}>
                <button
                    onClick={(e) => { e.preventDefault(); toggleDropdownAmPm() }}
                    className="inline-flex w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    aria-expanded={amPmOpen}
                >
                    AM/PM
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {amPmOpen && (
                    <div className="absolute left-28 mt-2 w-28 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            <ul>
                                <li onClick={(e) => { e.preventDefault(); setAmPm("AM"); }}>AM</li>
                                <li onClick={(e) => { e.preventDefault(); setAmPm("PM"); }}>PM</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropdownTime;