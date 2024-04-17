import { Box } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

const MoveIn = ({ isOpen, buttonRef, onToggle, setRef, moveInOption, setMoveInOption, selectedDate, setSelectedDate
}) => {
    const dropdownRef = useRef(null); // Ref for the dropdown itself
    const [dropdownStyle, setDropdownStyle] = useState({});

    const toggleDropdown = () => {
        if (onToggle) {
            onToggle(); // Call the onToggle prop, which should be connected to the parent's state management
        }
    };

    const handleMoveInChange = (event) => {
        setMoveInOption(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
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
        <Box className="mi-input-overlay" ref={dropdownRef} style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
            <select 
                value={moveInOption}
                onChange={handleMoveInChange}
                className='mi-select'
            >
                <option value="Anytime">Anytime</option>
                <option value="Now">Now</option>
                <option value="Before">Before a Date</option>
                <option value="After">After a Date</option>
            </select>
            {(moveInOption === 'Before' || moveInOption === 'After') && (
                <input
                    type="date"
                    
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            )}
        </Box>
    );
};

export default MoveIn;
