import React from 'react';

const ListingCard = ({ listing, siteDomain }) => {
  const { streetName, city, beds, baths, price, photos, id } = listing;
  // Check if 'photos' is not an empty array and the first photo is not undefined
  const imageUrl = photos && photos.length > 0 && photos[0] ? photos[0] : 'https://ygl-search.s3.us-east-2.amazonaws.com/imgs/no-img.webp';

  // Format price with commas
  const formattedPrice = price.toLocaleString();

  const handleClick = () => {
    window.open(`${siteDomain}/property.html?id=${id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={imageUrl} className="card-img-top" alt="Listing" />
      <div className="card-body">
        <h5 className="card-title">${formattedPrice}</h5>
        <p className="card-text">{`${beds} bed, ${baths} bath`}</p>
        <p className="card-text">{`${streetName}, ${city}`}</p>
      </div>
    </div>
  );
};

export default ListingCard;
