import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import { Grid, TextField, Button, Typography, Paper, Modal } from '@mui/material'; // Make sure Paper is included here



const PropertyDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [error, setError] = useState('');
    const theme = useTheme(); // Access theme to use breakpoints
    const isXSmall = useMediaQuery(theme.breakpoints.down('md')); 
    
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const matches = useMediaQuery('(min-width:1000px)');

    useEffect(() => {
        // Set the body overflow to scroll when the component mounts
        document.body.style.overflow = 'scroll';




        const getSiteQueryParam = () => {
            const queryParams = new URLSearchParams(location.search);
            return queryParams.get('site');
        };

        const siteDomain = getSiteQueryParam();
        if (id && siteDomain) {
            const apiUrl = 'https://server.brokersites.io/api/rentals';
            const params = {
                listing_id: id,
                site: siteDomain
            };

            const fetchData = async () => {
                try {
                    const response = await axios.post(apiUrl, params);
                    console.log("API Response:", response.data);
                    setPropertyDetails(response.data);
                } catch (err) {
                    console.error('Error fetching property details:', err);
                    setError('Error fetching property details');
                }
            };

            fetchData();
        }

        // Cleanup function to reset the body overflow when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [id, location]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!propertyDetails) {
        return <div>Loading...</div>;
    }

    const columns = isXSmall ? 3 : 6;

    const renderListingDetails = (listing) => {
        return (
            <>
                <h1> ${listing.price} </h1>
                <h2>
                {listing.streetName}, {listing.city}
                </h2>
                <h2>
                     {listing.beds} BR, {listing.baths} BA
                </h2>
                {listing.unitFeatures && listing.unitFeatures.length > 0 && (
                <>
                    <Typography variant="h6"><strong>Features</strong></Typography>
                    <ul>
                        {listing.unitFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </>
            )}
                <div>
                    <strong>Available Date:</strong> {listing.availableDate}
                </div>
                {listing.heatSource && (
                    <div>
                        <strong>Heat Source:</strong> {listing.heatSource}
                    </div>
                )}
                {listing.laundry && (
                    <div>
                        <strong>Laundry:</strong> {listing.laundry}
                    </div>
                )}
                {listing.pet && (
                    <div>
                        <strong>Pet Policy:</strong> {listing.pet}
                    </div>
                )}
                {listing.rentIncludes && listing.rentIncludes.length > 0 && (
                    <div>
                        <strong>Rent Includes:</strong> {listing.rentIncludes.join(", ")}
                    </div>
                )}
                {listing.studentPolicy &&(
                <div>
                <strong>Student Policy:</strong> {listing.studentPolicy}
                </div>
                )}
                {listing.unitDescription && (
                    <div>
                        <strong>Unit Description:</strong> {listing.unitDescription}
                    </div>
                )}
            </>
        );
    };

    const inquiryForm = (
        <form noValidate autoComplete="off">
        <TextField
            fullWidth
            label="Name"
            margin="normal"
        />
        <TextField
            fullWidth
            label="Phone"
            margin="normal"
        />
        <TextField
            fullWidth
            label="Email"
            margin="normal"
        />
        <TextField
            fullWidth
            label="Message"
            margin="normal"
            multiline
            rows={4}
        />
        <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
            Submit
        </Button>
    </form>
    );

    const listing = propertyDetails.listings[0];

    return (
    <div className='prop-det-container'>
        {propertyDetails.listings && propertyDetails.listings[0].unitPhotos && propertyDetails.listings[0].unitPhotos.length > 0 && (
        <Box
            sx={{
                width: '100%',
                height: '15em', // Adjust based on the height of two rows of images
                overflowX: 'auto'
            }}
        >
        <ImageList cols={columns} rowHeight={200} gap={8}>
            {propertyDetails.listings[0].unitPhotos.map((item) => (
                <ImageListItem key={item.id}>
                    <img
                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.caption || 'Property Image'}
                        loading="lazy"
                        style={{
                            width: '100%', // Ensure the image covers the full width of its container
                            height: '100%', // Ensure the image covers the full height of its container
                            objectFit: 'cover' // Ensure the image is scaled to maintain its aspect ratio while fitting within the element's content box
                        }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
        </Box>
        )}
        
        <div className='details-inquire' style={{ flexDirection: matches ? 'row' : 'column' }}>
                <div className="listing-details">
                    {renderListingDetails(listing)}
                </div>

                {matches ? (
                    // Show the form directly on screens wider than 1000px
                    <Paper className='dtop-form-modal' style={{ height:'fit-content', width:'40%', padding: 16, margin: '16px 0' }}>
                        <Typography variant="h6">INQUIRE</Typography>
                        {inquiryForm}
                    </Paper>
                ) : (
                    // Show a button to open the modal form on smaller screens
                    <Button variant="contained" onClick={handleOpen} style={{ marginTop: 16 }}>
                        Inquire
                    </Button>
                )}
        </div>

        <div className='save-footer'></div>

        <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    INQUIRE
                </Typography>
                <Box id="modal-modal-description" sx={{ mt: 2 }}>
                    {inquiryForm}
                </Box>
            </Box>
        </Modal>

    </div>
        
    );
};

export default PropertyDetails;
