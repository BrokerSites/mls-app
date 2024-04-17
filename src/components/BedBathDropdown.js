import React, { useState, useRef, useEffect } from 'react';
import { Box, Slider } from '@mui/material';

const BedBathDropdown = ({ bedsBaths, onBedsBathsChange, isOpen, onToggle, buttonRef, setRef }) => {
    const dropdownRef = useRef(null); // Ref for the dropdown itself
    const [dropdownStyle, setDropdownStyle] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const key = name.split('-')[0]; // 'beds' or 'baths'
        const index = name.endsWith('min') ? 0 : 1;

        let updatedValue = '';
        if (value === 'Studio' && key === 'beds' && index === 0) {
            updatedValue = 0; // Special case for studio at minimum value
        } else if (value === '5+' && index === 1) {
            updatedValue = 5; // Special case for 5+ at maximum value
        } else if (!isNaN(value) && value !== '') {
            updatedValue = Number(value);
        }

        const updatedValues = [...bedsBaths[key]];
        updatedValues[index] = updatedValue;

        onBedsBathsChange({ ...bedsBaths, [key]: updatedValues });
    };


    const formatValue = (value, type) => {
        if (value === '') return '';
        if (type === 'beds') return value === 0 ? 'Studio' : value >= 5 ? '5+' : value.toString();
        return value >= 5 ? '5+' : value.toString(); // Assuming same logic for baths
    };

    useEffect(() => {
        if (isOpen) {
            setRef(dropdownRef.current);
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownWidth = dropdownRef.current.offsetWidth;
            setDropdownStyle({
                display: 'block', // Make sure the dropdown is visible when it's open
                top: `${buttonRect.bottom + window.scrollY}px`, // Position below the button
                // Subtract the dropdown width from the button's right edge position to align their right edges
                left: `${buttonRect.right - dropdownWidth + window.scrollX}px`,
                position: 'absolute'
            });
        }
    }, [isOpen, buttonRef, setRef, dropdownRef]);

    if (!isOpen) return null;

    return (
                <Box className="bb-input-overlay" ref={dropdownRef} style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                    <div className="slider-container">
                        <div className="slider-label">BEDS</div>
                        <Slider
                            value={bedsBaths.beds.map(b => b === '' ? 0 : b)} // Ensure slider works with numbers
                            onChange={(event, newValue) => onBedsBathsChange({ ...bedsBaths, beds: newValue })}
                            valueLabelDisplay="auto"
                            min={0}
                            max={5}
                            step={1}
                            valueLabelFormat={(value) => formatValue(value, 'beds')}
                            marks={[
                                { value: 0, label: 'Min' },
                                { value: 5, label: 'Max' },
                            ]}
                        />
                        <div className="input-container">
                        <input
                                className="option-input"
                                type="text"
                                name="beds-min"
                                value={formatValue(bedsBaths.beds[0], 'beds')}
                                onChange={handleInputChange}
                                onClick={(e) => e.target.select()}
                            />
                            <input
                                className="option-input"
                                type="text"
                                name="beds-max"
                                value={formatValue(bedsBaths.beds[1], 'beds')}
                                onChange={handleInputChange}
                                onClick={(e) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className="slider-container">
                        <div className="slider-label">BATHS</div>
                        <Slider
                            value={bedsBaths.baths.map(b => b === '' ? 0 : b)}
                            onChange={(event, newValue) => onBedsBathsChange({ ...bedsBaths, baths: newValue })}
                            valueLabelDisplay="auto"
                            min={1}
                            max={5}
                            step={1}
                            valueLabelFormat={(value) => formatValue(value, 'baths')}
                            marks={[
                                { value: 1, label: 'Min' },
                                { value: 5, label: 'Max' }
                            ]}
                        />
                        <div className="input-container">
                        <input
                                className="option-input"
                                type="text"
                                name="baths-min"
                                value={formatValue(bedsBaths.baths[0], 'baths')}
                                onChange={handleInputChange}
                                onClick={(e) => e.target.select()}
                            />
                            <input
                                className="option-input"
                                type="text"
                                name="baths-max"
                                value={formatValue(bedsBaths.baths[1], 'baths')}
                                onChange={handleInputChange}
                                onClick={(e) => e.target.select()}
                            />
                        </div>
                    </div>
                </Box>
    );
};

export default BedBathDropdown;
