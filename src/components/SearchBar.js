import React, { useState, useRef, useEffect } from 'react';
import PriceDropdown from './PriceDropdown';
import Autocomplete from './Autocomplete';
import TagBox from './TagBox';
import BedBathDropdown from './BedBathDropdown';
import MoveIn from './MoveIn';
import AllFilters from './AllFilters';
import ResultsBanner from './ResultsBanner'; // Import ResultsBanner component
import PaginationComponent from './PaginationComponent';

const SearchBar = ({
    cities,
    modalState,
    setModalState,
    onSelectTag,
    selectedTags,
    onRemoveTag,
    toggleView,
    isMapView,
    minRent,
    maxRent,
    onMinRentChange,
    onMaxRentChange,
    bedsBaths,
    setBedsBaths,
    moveInOption,
    setMoveInOption,
    selectedDate,
    setSelectedDate,
    hasPhotos,
    setHasPhotos,
    isPetFriendly,
    setIsPetFriendly,
    hasParking,
    setHasParking,
    totalResults,
    listings,
    onPageChange,
    onSortChange,
    sortParams,
    setSortParams,  // Add this to allow resetting sortParams
    currentPage={currentPage},
    itemsPerPage={itemsPerPage},
    setSelectedTags,
    setMinRent,
    setMaxRent,
    page,

}) => {
    const [searchText, setSearchText] = useState('');


    const priceButtonRef = useRef(null); // Ref for price button
    const bedBathButtonRef = useRef(null);
    const moveInButtonRef = useRef(null); // Add ref for Move-In button
    const allFiltersButtonRef = useRef(null); // Add ref for Move-In button

    const modalRefs = useRef([]);

    const closeAllFiltersModal = () => {
        setModalState(prevState => ({
            ...prevState,
            showAllFiltersInput: false
        }));
    };

    const setModalRef = (element) => {
        // Make sure we are storing the element correctly and not overwriting with non-DOM values
        if (element) {
            modalRefs.current = [element]; // Should only hold one element for the current modal, adjust if managing multiple modals
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSelectTag(searchText);
        setSearchText('');
    };


    const formatBeds = (value) => {
      if (value === '') return '';
      return value === 0 ? 'Studio' : value >= 5 ? '5+' : value.toString();
  };

  const formatBaths = (value) => {
      if (value === '') return '';
      return value >= 5 ? '5+' : value.toString();
  };


  const toggleModal = (modalName) => {
    setModalState(prevState => ({
        ...prevState,
        [modalName]: !prevState[modalName],
    }));
};



useEffect(() => {
    const handleClickOutside = (event) => {
        if (modalRefs.current.length && modalRefs.current[0] && !modalRefs.current[0].contains(event.target)) {
          if (modalState.showPriceInput && priceButtonRef.current && !priceButtonRef.current.contains(event.target)) {
            setModalState(prevState => ({ ...prevState, showPriceInput: false }));
          }
          if (modalState.showBedBathInput && bedBathButtonRef.current && !bedBathButtonRef.current.contains(event.target)) {
            setModalState(prevState => ({ ...prevState, showBedBathInput: false }));
          }
          if (modalState.showMoveInInput && moveInButtonRef.current && !moveInButtonRef.current.contains(event.target)) {
            setModalState(prevState => ({ ...prevState, showMoveInInput: false }));
          }
          if (modalState.showAllFiltersInput && allFiltersButtonRef.current && !allFiltersButtonRef.current.contains(event.target)) {
            setModalState(prevState => ({ ...prevState, showAllFiltersInput: false }));
          }
        }
      };


    // We add the event listener if any modal is open
    if (modalState.showPriceInput || modalState.showBedBathInput || modalState.showMoveInInput || modalState.showAllFiltersInput) {
        document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component is unmounted or if all modals are closed
    return () => {
        if (!modalState.showPriceInput && !modalState.showBedBathInput && !modalState.showMoveInInput && !modalState.showAllFiltersInput) {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };
}, [modalState, priceButtonRef, bedBathButtonRef, moveInButtonRef, allFiltersButtonRef]);


const clearSearch = () => {
    setSelectedTags([]); // Assuming setSelectedTags is received as a prop
    setMinRent(0); // Assuming setMinRent is received as a prop
    setMaxRent(10000); // Assuming setMaxRent is received as a prop
    setBedsBaths({ beds: [0, 5], baths: [1, 5] }); // Already received as a prop
    setMoveInOption('Anytime'); // Already received as a prop
    setSelectedDate(''); // Already received as a prop
    setHasPhotos(false); // Already received as a prop
    setIsPetFriendly(false); // Already received as a prop
    setHasParking(false); // Already received as a prop
    setSortParams({ sort_name: null, sort_dir: null }); // Assuming setSortParams is received as a prop
};;


    return (
      <div className="search-bar">
      <div className="row  first-row">
          <div className="col search-input">
              <form onSubmit={handleSubmit} className="w-100 d-flex">
                  <div className="input-group">
                      <Autocomplete cities={cities} onSelectTag={onSelectTag} setSearchText={setSearchText} />
                      <button className="btn btn-outline-primary" type="submit">
                          <i className="bi bi-search"></i> {/* Use the icon here */}
                      </button>
                  </div>
              </form>
          </div>
          <button
              ref={priceButtonRef} // Attach ref to button
              className="btn btn-primary dropdown-toggle p-btn"
              onClick={() => toggleModal('showPriceInput')}
          >
              Price
          </button>
          <PriceDropdown
              setRef={setModalRef} // new prop to pass the ref setting function
              buttonRef={priceButtonRef} // Pass ref to PriceDropdown
              minRent={minRent}
              maxRent={maxRent}
              onRentChange={(newValue) => {
                  const [newMinRent, newMaxRent] = newValue;
                  onMinRentChange(newMinRent);
                  onMaxRentChange(newMaxRent);
              }}
              isOpen={modalState.showPriceInput}
          />
          <button
          ref={bedBathButtonRef}
          className="btn btn-primary dropdown-toggle bb-btn"
          onClick={() => toggleModal('showBedBathInput')}
          >
          Beds + Baths
          </button>
          {modalState.showBedBathInput && (
          <BedBathDropdown
              setRef={setModalRef} // new prop to pass the ref setting function
              buttonRef={bedBathButtonRef} // Pass ref to BedBathDropdown
              bedsBaths={bedsBaths}
              onBedsBathsChange={setBedsBaths}
              isOpen={modalState.showBedBathInput}
              onToggle={() => toggleModal('showBedBathInput')}
              formatBeds={formatBeds}
              formatBaths={formatBaths}
          />
          )}
            <button
                ref={moveInButtonRef} // Attach ref to Move-In button
                className="btn btn-primary dropdown-toggle mi-btn"
                onClick={() => toggleModal('showMoveInInput')}
            >
                Move-In
            </button>
            {modalState.showMoveInInput && (
            <MoveIn
                setRef={setModalRef} // new prop to pass the ref setting function
                buttonRef={moveInButtonRef} // Pass ref to MoveIn
                isOpen={modalState.showMoveInInput}
                onToggle={() => toggleModal('showMoveInInput')}
                moveInOption={moveInOption}
                setMoveInOption={setMoveInOption}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
            )}
          
          <button
                ref={allFiltersButtonRef} // Attach ref to Move-In button
                className="btn btn-primary af-btn"
                onClick={() => toggleModal('showAllFiltersInput')}
            >
                All Filters
            </button>
            {modalState.showAllFiltersInput && (
            <AllFilters
                handleClose={closeAllFiltersModal} // Pass this function    
                setRef={setModalRef} // new prop to pass the ref setting function
                buttonRef={allFiltersButtonRef} // Pass ref to MoveIn
                isOpen={modalState.showAllFiltersInput}
                onToggle={() => toggleModal('showAllFiltersInput')}
                minRent={minRent}
                maxRent={maxRent}
                onRentChange={(newValue) => {
                  const [newMinRent, newMaxRent] = newValue;
                  onMinRentChange(newMinRent);
                  onMaxRentChange(newMaxRent);
                }}
                bedsBaths={bedsBaths}
                onBedsBathsChange={setBedsBaths}
                moveInOption={moveInOption}
                setMoveInOption={setMoveInOption}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                hasPhotos={hasPhotos}
                setHasPhotos={setHasPhotos}
                isPetFriendly={isPetFriendly}
                setIsPetFriendly={setIsPetFriendly}
                hasParking={hasParking}
                setHasParking={setHasParking}
                listings
            />
            )}
              <button
                    className="btn btn-danger c-btn" // Using btn-danger for red color
                    onClick={clearSearch}
                >
                    Clear
            </button>
      </div>
      <div className="row mobile-options">
          <div className="col mobile-tag-box-container">
              {/* Conditionally render TagBox only for mobile view */}
              <TagBox tags={selectedTags} onRemoveTag={onRemoveTag} />
          </div>
          <div className="col-auto ms-auto">
              <button className="btn btn-outline-primary" type="button" onClick={toggleView}>
                  {isMapView ? 'List' : 'Map'}
              </button>
          </div>
      </div>
      <div className='s-rb-wrap'>
      <ResultsBanner 
      count={listings.length} 
      total={totalResults} 
      onSortChange={onSortChange}
      sortParams={sortParams}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      />
        <PaginationComponent 
        className="sb-pc"
        totalResults={totalResults}
        itemsPerPage={itemsPerPage}
        page={page}
        onPageChange={onPageChange}
      />
      </div>
  </div>
    );
};

export default SearchBar;