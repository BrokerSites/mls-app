import React from 'react';

const ListingCard = ({ listing, siteDomain }) => {
  // Adjust destructuring based on SimplyRETS response
  const { address, property, listPrice, photos, mlsId } = listing;
  const { streetName, city } = address;
  const { bedrooms, bathsFull } = property;

  const imageUrl = photos && photos.length > 0 ? photos[0] : 'https://ygl-search.s3.us-east-2.amazonaws.com/imgs/no-img.webp';
  const formattedPrice = listPrice.toLocaleString();

  const handleClick = () => {
    window.open(`${siteDomain}/property.html?id=${mlsId}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={imageUrl} className="card-img-top" alt="Listing" />
      <div className="card-body">
        <h5 className="card-title">${formattedPrice}</h5>
        <p className="card-text">{`${bedrooms} bed, ${bathsFull} bath`}</p>
        <p className="card-text">{`${streetName}, ${city}`}</p>
      </div>
    </div>
  );
};

export default ListingCard;
