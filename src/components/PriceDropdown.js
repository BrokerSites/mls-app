import React, { useRef, useEffect, useState } from 'react';
import { Box, Slider } from '@mui/material';

const PriceDropdown = ({ minRent, maxRent, onRentChange, isOpen, buttonRef, setRef }) => {
    const dropdownRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});

    const formatNumberWithCommas = (value) => {
        // Ensure we're dealing with a number before trying to format it
        if (typeof value === 'number') {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return value;
    };

    const parseFormattedNumber = (formattedValue) => {
        // Ensure we're dealing with a string before trying to parse it
        if (typeof formattedValue === 'string') {
            return parseInt(formattedValue.replace(/,/g, ''), 10) || 0;
        }
        return formattedValue;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const numericValue = parseFormattedNumber(value);
        if (name === 'minRent') {
            onRentChange([numericValue, maxRent]);
        } else if (name === 'maxRent') {
            onRentChange([minRent, numericValue]);
        }
    };

    const handleSliderChange = (event, newValue) => {
        // Directly use the number array from the slider without parsing
        onRentChange(newValue);
    };

    useEffect(() => {
        if (isOpen) {
            setRef(dropdownRef.current);
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownWidth = dropdownRef.current.offsetWidth;
            setDropdownStyle({
                display: 'block',
                top: `${buttonRect.bottom + window.scrollY}px`,
                left: `${buttonRect.right - dropdownWidth + window.scrollX}px`,
                position: 'absolute'
            });
        }
    }, [isOpen, buttonRef, setRef, dropdownRef]);

    if (!isOpen) return null;

    return (
        <Box className="input-overlay" ref={dropdownRef} style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
            <Slider
                value={[minRent, maxRent]}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={0}
                max={30000000}
                step={100000}
            />
            <div className='option-input-div'>
                <input
                    className='option-input'
                    type="text"
                    name="minRent"
                    value={formatNumberWithCommas(minRent)}
                    onChange={handleInputChange}
                    onClick={(e) => e.target.select()}
                />
                <input
                    className='option-input'
                    type="text"
                    name="maxRent"
                    value={formatNumberWithCommas(maxRent)}
                    onChange={handleInputChange}
                    onClick={(e) => e.target.select()}
                />
            </div>
        </Box>
    );
};

export default PriceDropdown;
