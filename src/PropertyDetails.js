import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, ImageList, ImageListItem, Modal, Paper, TextField, Typography } from '@mui/material';

const PropertyDetails = () => {
    const location = useLocation();
    const theme = useTheme();
    const isXSmall = useMediaQuery(theme.breakpoints.down('md'));
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    useEffect(() => {
        document.body.style.overflow = 'scroll';
        const getPathSegments = () => window.location.pathname.split('/');
        const propertyIdIndex = getPathSegments().indexOf('property') + 1;
        const propertyId = getPathSegments()[propertyIdIndex];

        if (propertyId) {
            const apiUrl = `https://api.simplyrets.com/properties/${propertyId}`;
            const options = {
                auth: {
                    username: 'simplyrets',
                    password: 'simplyrets'
                }
            };

            const fetchData = async () => {
                try {
                    const response = await axios.get(apiUrl, options);
                    setPropertyDetails(response.data);
                } catch (err) {
                    setError('Error fetching property details');
                }
            };

            fetchData();
        }
        
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!propertyDetails) {
        return <div>Loading...</div>;
    }

    const renderListingDetails = (details) => {
        return (
            <>
                <Typography variant="h5">${details.listPrice}</Typography>
                <Typography variant="subtitle1">{details.address.full}</Typography>
                <Typography variant="subtitle1">
                    {details.property.bedrooms} BR, {details.property.bathsFull} BA
                </Typography>
                <Typography variant="body2">Status: {details.mls.status}</Typography>
                <Typography variant="body2">MLS Number: {details.mlsId}</Typography>
                <Typography variant="body2">Town: {details.address.city}</Typography>
                <Typography variant="body2">State: {details.address.state}</Typography>
                <Typography variant="body2">Listing Office: BrokerSites </Typography>
                <Typography variant="body2">Listing Agent: Chris Cafferty</Typography>
                <Typography variant="body1">{details.remarks}</Typography>
            </>
        );
    };

    const inquiryForm = (
        <form noValidate autoComplete="off">
            <TextField fullWidth label="Name" margin="normal" />
            <TextField fullWidth label="Phone" margin="normal" />
            <TextField fullWidth label="Email" margin="normal" />
            <TextField fullWidth label="Message" margin="normal" multiline rows={4} />
            <Button variant="contained" color="primary" style={{ marginTop: 16 }}>
                Submit
            </Button>
        </form>
    );

    return (
        <div className='prop-det-container'>
            <Box className="carousel-box" sx={{ width: '100%', overflowX: 'auto' }}>
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        {propertyDetails.photos.map((url, index) => (
                            <li key={index} data-target="#carouselExampleIndicators" data-slide-to={index} className={index === 0 ? 'active' : ''}></li>
                        ))}
                    </ol>
                    <div className="carousel-inner">
                        {propertyDetails.photos.map((url, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img className="d-block w-100" src={url} alt={`Slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </Box>

            <div className='details-inquire' style={{ flexDirection: isXSmall ? 'column' : 'row' }}>
                <div className="listing-details">
                    {renderListingDetails(propertyDetails)}
                </div>

                {isXSmall ? (
                    <Button variant="contained" onClick={handleOpen} style={{ marginTop: 16 }}>
                        Inquire
                    </Button>
                ) : (
                    <Paper className='inquiry-form' style={{ padding: 16 }}>
                        <Typography variant="h6">INQUIRE</Typography>
                        {inquiryForm}
                    </Paper>
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
