import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListingsContainer from './components/ListingsContainer';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import axios from 'axios';

const App = () => {
    
    const queryParams = new URLSearchParams(window.location.search);
    const siteDomain = queryParams.get('site');

    const [cities, setCities] = useState([]);

    const [isMobileMapView, setIsMobileMapView] = useState(false);
    const [listings, setListings] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);
    const [cityNeighborhood, setCityNeighborhood] = useState('');
    const [minRent, setMinRent] = useState(0); // Default minimum rent
    const [maxRent, setMaxRent] = useState(10000000); // Default maximum rent
    const [moveInOption, setMoveInOption] = useState('Anytime');
    const [selectedDate, setSelectedDate] = useState('');
    const [bedsBaths, setBedsBaths] = useState({ beds: [0, 5], baths: [1, 5] });
    const [hasPhotos, setHasPhotos] = useState(false);
    const [isPetFriendly, setIsPetFriendly] = useState(false);
    const [hasParking, setHasParking] = useState(false);
    const [totalResults, setTotalResults] = useState(0); // Add a state variable to store the total results
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;
    const [sortParams, setSortParams] = useState({ sort_name: null, sort_dir: null });
    const [modalClosed, setModalClosed] = useState(false);

    const handleSortChange = (event) => {
        const value = event.target.value;
        let sortName, sortDir;
        
        switch (value) {
          case 'highToLow':
            sortName = 'rent';
            sortDir = 'desc';
            break;
          case 'lowToHigh':
            sortName = 'rent';
            sortDir = 'asc';
            break;
          case 'default':
          default:
            sortName = null;
            sortDir = null;
            break;
        }
      
        setSortParams({ sort_name: sortName, sort_dir: sortDir });
      };

      useEffect(() => {
        fetchCities();
    }, []);

        function fetchCities() {
        const auth = {
            username: 'simplyrets',
            password: 'simplyrets'
        };

        axios.get('https://api.simplyrets.com/properties', { auth })
            .then(response => {
                const citiesSet = new Set();
                response.data.forEach(listing => {
                    if (listing.address && listing.address.city) {
                        citiesSet.add(listing.address.city);
                    }
                });
                const sortedCities = Array.from(citiesSet).sort();
                console.log(sortedCities);
                setCities(sortedCities);
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
            });
    }

    
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        };

    const [modalState, setModalState] = useState({
        showPriceInput: false,
        showBedBathInput: false,
        showMoveInInput: false, // New state for MoveIn
        showAllFiltersInput: false, // New state for MoveIn
    });


    const handleSelectTag = (tag) => {
        // Check if the tag is in the cities list or matches the pattern "Neighborhood (City)"
        const isValidTag = cities.includes(tag);
        if (isValidTag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);  // Add tag to the array
        }
    };
    
    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));  // Remove tag from the array
    };

    useEffect(() => {
        // Other code...
    
        // When the component mounts, change the height of the body
        document.body.style.height = 'auto';
    
        // Cleanup function to reset styles when the component unmounts
        return () => {
            // Reset any styles you've set
            document.body.style.height = '';
        };
    }, []);



    const fetchRentals = async () => {
        const params = new URLSearchParams({
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage
        });
    
        // Append each selected city as a separate 'cities' parameter
        selectedTags.forEach(city => {
            params.append('cities', city);
        });
    
        // Include minimum and maximum price filters if they are set
        if (minRent > 0) {
            params.append('minprice', minRent);
        }
        if (maxRent < 10000000) { // Assuming 10,000,000 is your upper bound
            params.append('maxprice', maxRent);
        }
    
        // Include beds and baths filters
        if (bedsBaths.beds[0] > 0) {
            params.append('minbeds', bedsBaths.beds[0]);
        }
        if (bedsBaths.beds[1] && bedsBaths.beds[1] < 5) { // Check if there is a maximum limit set for beds
            params.append('maxbeds', bedsBaths.beds[1]);
        }
    
        if (bedsBaths.baths[0] > 0) {
            params.append('minbaths', bedsBaths.baths[0]);
        }
        if (bedsBaths.baths[1] && bedsBaths.baths[1] < 5) { // Check if there is a maximum limit set for baths
            params.append('maxbaths', bedsBaths.baths[1]);
        }
    
        try {
            const response = await axios.get('https://api.simplyrets.com/properties', {
                params: params, // Directly use the URLSearchParams object
                auth: {
                    username: 'simplyrets',
                    password: 'simplyrets'
                }
            });
            console.log("API Response:", response.data);
            setListings(response.data);
            setTotalResults(response.data.length);
        } catch (error) {
            console.error('Error fetching rental listings:', error);
            setListings([]);
            setTotalResults(0);
        }
    };
    
    
    

    useEffect(() => {
        // This function will check if any modal has just been opened or closed
        const modalJustClosed = Object.entries(modalState).some(([key, value]) => 
            !value && prevModalStateRef.current[key]
        );
        const modalJustOpened = Object.entries(modalState).some(([key, value]) => 
            value && !prevModalStateRef.current[key]
        );
    
        if (modalJustClosed) {
            console.log("Modal has been closed");
            setModalClosed(true);  // Set to true when a modal closes
        }
    
        if (modalJustOpened) {
            console.log("Modal has been opened");
        }
    
        // Reset modalClosed to false after acknowledging the closure
        if (modalClosed) {
            setModalClosed(false);
        }
    
        // Update the previous modal state to the current one for the next render
        prevModalStateRef.current = modalState;
    }, [modalState]);
    
    
    useEffect(() => {
        fetchRentals();
    }, [selectedTags, currentPage, modalClosed]);  // Add modalState to the dependency array

    
    useEffect(() => {
        console.log("Listings Updated:", listings);
    }, [listings]);
    

    useEffect(() => {
    // Build your API parameters here as you have them already defined
    const apiParams = {
        site: siteDomain, // include the siteDomain in the API call parameters
        cities: cityNeighborhood,
        minbeds: prepareBedsBathsValues(bedsBaths).minBed,
        maxbeds: prepareBedsBathsValues(bedsBaths).maxBed,
        minbaths: prepareBedsBathsValues(bedsBaths).bathsRange.join(','),
        minprice: minRent,
        maxprice: maxRent >= 10000 ? undefined : maxRent,
        avail_from: formatDateForApi(moveInOption, selectedDate).availFrom,
        avail_to: formatDateForApi(moveInOption, selectedDate).availTo,
        photo: hasPhotos ? 'Y' : undefined,
        pet: isPetFriendly ? 'friendly' : undefined,
        parking: hasParking ? 'Y' : undefined,
        ...(sortParams.sort_name && { sort_name: sortParams.sort_name }),
        ...(sortParams.sort_dir && { sort_dir: sortParams.sort_dir }),
        page_count: itemsPerPage,
        page_index: currentPage, // Use the current page here
    };

    // This will trigger the fetchRentals function whenever sortParams changes.
    fetchRentals(apiParams);
}, [sortParams, currentPage]);


    useEffect(() => {
        const formatted = selectedTags.map(tag => {
            if (tag.includes('(')) {
                const parts = tag.match(/(.*)\s\((.*)\)/);
                return `${parts[2]}:${parts[1]}`;
            }
            return tag;
        }).join(',');
        setCityNeighborhood(formatted);
    }, [selectedTags]);


    //Organize the variables we will send to the API here, then put them under a greater variable. 
    //Any time one of the minor variables change, the greater is updated and a new call is made


    const prevModalStateRef = useRef(modalState);
    const prevSelectedTagsRef = useRef(selectedTags);
    const upperLimitForBaths = 20; // Max limit for baths
    const previousValuesRef = useRef({ cityNeighborhood, bedsBaths, minRent, maxRent, moveInOption, selectedDate });

    const prepareBedsBathsValues = (bedsBaths) => {
        let minBed = bedsBaths.beds[0];
        let maxBed = bedsBaths.beds[1];
        let bathsRange = [];

        // Handle beds
        if (maxBed === '5+' || maxBed === 5) {
            maxBed = undefined; // No upper limit for beds
        }

        // Handle baths
        let minBath = parseInt(bedsBaths.baths[0]);
        let maxBath = parseInt(bedsBaths.baths[1] === '5+' ? upperLimitForBaths : bedsBaths.baths[1]);

        if (maxBath === 5) {
            maxBath = upperLimitForBaths; // Extend to the upper limit
        }

        for (let i = minBath; i <= maxBath; i++) {
            bathsRange.push(i);
        }

        return { minBed, maxBed, bathsRange };
    };

    const formatDateForApi = (moveInOption, selectedDate) => {
        let availFrom, availTo;

        // Function to format date from YYYY-MM-DD to MM/DD/YY
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
        };

        switch (moveInOption) {
            case 'Anytime':
                availFrom = undefined;
                availTo = undefined;
                break;
            case 'Now':
                availTo = formatDate(new Date()); // Use current date for 'Now'
                break;
            case 'Before':
                availTo = formatDate(selectedDate); // Use the selected date for 'Before'
                break;
            case 'After':
                availFrom = formatDate(selectedDate); // Use the selected date for 'After'
                break;
        }

        return { availFrom, availTo };
    };

    useEffect(() => {
        console.log("Selected cities for search:", selectedTags.join(', '));
    }, [selectedTags]);
        

    useEffect(() => {
        console.log("Total Results:", totalResults);
    }, [totalResults]);


    const toggleMobileView = () => setIsMobileMapView(!isMobileMapView);

    return (
        <>
            <div className='search-container'>
                <SearchBar
                    modalState={modalState}
                    setModalState={setModalState}
                    cities={cities}
                    onSelectTag={handleSelectTag}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags} // Pass setSelectedTags as a prop
                    onRemoveTag={handleRemoveTag}
                    toggleView={toggleMobileView}
                    isMapView={isMobileMapView}
                    minRent={minRent}
                    setMinRent={setMinRent} // Pass setMinRent as a prop
                    maxRent={maxRent}
                    setMaxRent={setMaxRent} // Pass setMaxRent as a prop
                    onMinRentChange={setMinRent}
                    onMaxRentChange={setMaxRent}
                    bedsBaths={bedsBaths}
                    setBedsBaths={setBedsBaths}
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
                    totalResults={totalResults}
                    listings={listings}
                    sortParams={sortParams}
                    setSortParams={setSortParams} // Add this line if you need to manipulate sortParams from SearchBar
                    onSortChange={handleSortChange}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    page={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
            <div className="desktop-view">
                <div className='listings-and-map'>
                    <ListingsContainer
                        listings={listings}
                        selectedTags={selectedTags}
                        onRemoveTag={handleRemoveTag}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        page={currentPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onSortChange={handleSortChange}
                        sortParams={sortParams}
                        siteDomain={siteDomain}
                    />
                    <div className='map-container'>
                        <MapComponent listings={listings} siteDomain={siteDomain}/>
                    </div>
                </div>

            </div>
            <div className="mobile-view">
                {isMobileMapView ? (
                    <MapComponent listings={listings} siteDomain={siteDomain} />
                ) : (
                    <ListingsContainer
                        listings={listings}
                        selectedTags={selectedTags}
                        onRemoveTag={handleRemoveTag}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        page={currentPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        siteDomain={siteDomain}
                    />
                )}
            </div>
        </>
    );
};

export default App;