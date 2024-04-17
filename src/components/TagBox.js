import React from 'react';

const TagBox = ({ tags, onRemoveTag }) => {
  return (
    <div className="tag-box form-control">
      {tags.length > 0 ? (
        tags.map((tag, index) => (
          <div key={index} className="tag">
            {tag}
            <button onClick={() => onRemoveTag(tag)}>✕</button>
          </div>
        ))
      ) : (
        <div className="tag-placeholder">
          Locations
        </div>
      )}
    </div>
  );
};

export default TagBox;