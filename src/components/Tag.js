import React from 'react';
import { Badge } from 'react-bootstrap';
import '../index.css'; // Adjust the import path if necessary

const Tag = ({ text, onRemove }) => {
    return (
        <Badge pill bg="primary" className={`me-2 text-white tag-badge`}>
            {text}
            <span onClick={() => onRemove(text)} className="tag-x">
                &times;
            </span>
        </Badge>
    );
};

export default Tag;