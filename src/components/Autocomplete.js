import React, { useState, useEffect, useRef } from 'react';

function Autocomplete({ cities, setSearchText, onSelectTag }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const regex = new RegExp(`^${value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
      setSuggestions(cities.filter(city => regex.test(city)));
    } else {
      setSuggestions(cities);
    }
    setHighlightedIndex(-1);  // Reset the highlighted index on input change
  };

  const handleFocus = () => {
    setSuggestions(cities);
    setHighlightedIndex(-1);
  };

  const handleSelectItem = (item) => {
    setSearchText(item);
    onSelectTag(item);
    setInputValue('');
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      setHighlightedIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        handleSelectItem(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectItem(suggestions[0]);  // Select the first item if none is highlighted
      }
      e.preventDefault();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
        <input
            type="text"
            className="form-control custom-rounded"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search city or neighborhood"
        />
        {suggestions.length > 0 && (
            <ul className="autocomplete-container">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        className={`autocomplete-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                        onClick={() => handleSelectItem(suggestion)}
                    >
                        {suggestion}
                    </li>
                ))}
            </ul>
        )}
    </div>
  );
}

export default Autocomplete;
