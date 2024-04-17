import React, { useRef, useEffect, useState } from 'react';
import { Box, Slider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const AllFilters = ({
    handleClose,
    isOpen,
    setRef,
    minRent,
    maxRent,
    onRentChange,
    bedsBaths,
    onBedsBathsChange,
    moveInOption, 
    setMoveInOption, 
    selectedDate, 
    setSelectedDate,
    hasPhotos,
    setHasPhotos,
    isPetFriendly,
    setIsPetFriendly,
    hasParking,
    setHasParking
}) => {
    const dropdownRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});
    
    const formatNumberWithCommas = (number) => {
        // Only try to format if it's a number
        return typeof number === 'number' ? number.toLocaleString() : number;
    };
    const parseNumberFromFormatted = (formattedString) => {
        return formattedString ? parseInt(formattedString.replace(/,/g, ''), 10) : 0;
    };


    const [filters, setFilters] = useState({
        pets: false,
        parking: false,
        photos: false,
        // ... other filters
    });

    useEffect(() => {
        if (isOpen) {
            setRef(dropdownRef.current);
            setDropdownStyle({
                display: 'block',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                height: 'auto',
            });
        }
    }, [isOpen, setRef, dropdownRef]);

    const handleSliderChange = (name, newValue) => {
        if (name === 'rent') {
            onRentChange(newValue);
        } else {
            const key = name; // 'beds' or 'baths'
            onBedsBathsChange({ ...bedsBaths, [key]: newValue });
        }
    };

    if (!isOpen) return null;

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onRentChange(name === 'minRent' ? [parseNumberFromFormatted(value), maxRent] : [minRent, parseNumberFromFormatted(value)]);
    };


    const handleBedsBathsChange = (event) => {
        
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

    const handleMoveInChange = (event) => {
        setMoveInOption(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <Box className="af-input-overlay" ref={dropdownRef} style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
        <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
        >
            <CloseIcon />
        </IconButton>
            <div className='af-price'>
                <div>PRICE</div>
                <Slider
                    value={[minRent, maxRent]}
                    onChange={(event, newValue) => handleSliderChange('rent', newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
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
            </div>

            <div className='af-bb-1'>
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
                                onChange={handleBedsBathsChange}
                                onClick={(e) => e.target.select()}
                            />
                            <input
                                className="option-input"
                                type="text"
                                name="beds-max"
                                value={formatValue(bedsBaths.beds[1], 'beds')}
                                onChange={handleBedsBathsChange}
                                onClick={(e) => e.target.select()}
                            />
                        </div>
                </div>
            </div>
            <div className='af-bb-2'>
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
                                onChange={handleBedsBathsChange}
                                onClick={(e) => e.target.select()}
                            />
                            <input
                                className="option-input"
                                type="text"
                                name="baths-max"
                                value={formatValue(bedsBaths.baths[1], 'baths')}
                                onChange={handleBedsBathsChange}
                                onClick={(e) => e.target.select()}
                            />
                        </div>
                    </div>
            </div>
            <div className='af-mi' >
                <div>
                    MOVE-IN DATE
                </div>
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
            </div>
            <form className='af-checks'>
                <div className='af-check-wrap'>
                    <input
                        type="checkbox"
                        id="pets"
                        checked={isPetFriendly}
                        onChange={() => setIsPetFriendly(!isPetFriendly)}
                    />
                    <label htmlFor="petFriendly">Pet Friendly</label>
                </div>
                <div className='af-check-wrap'>
                    <input
                        type="checkbox"
                        id="parking"
                        checked={hasParking}
                        onChange={() => setHasParking(!hasParking)}
                    />
                    <label htmlFor="freeParking">Has Parking</label>
                </div>
                <div className='af-check-wrap'>
                    <input
                        type="checkbox"
                        id="photos"
                        checked={hasPhotos}
                        onChange={() => setHasPhotos(!hasPhotos)}
                    />
                    <label htmlFor="pool">Has Photos</label>
                </div>
                {/* Add more filter options as needed */}
            </form>
        </Box>
    );
};

export default AllFilters;
