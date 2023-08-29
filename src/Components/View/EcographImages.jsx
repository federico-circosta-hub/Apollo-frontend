import { Checkbox } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { NewVisitContext } from "../Model/NewVisitContext";


const EcographImages = (props) => {


    const handleSelect = (e, photo) => {
        props.setSelectedImages(prevSelectedImages => {
            if (e.target.checked) {
                return [...prevSelectedImages, photo];
            } else {
                return prevSelectedImages.filter(selectedImage => selectedImage !== photo);
            }
        });
    };

    return (
        <div className="photo-gallery">
            <div style={style.photoContainer} className="photo-container">
                {props.photos.map((photo, index) => (
                    <div key={index} style={{ padding: '1%', display: 'flex', flexDirection: 'column', margin: '0 10px', background: props.selectedImages.includes(photo) ? '#90ee90' : '' }}>
                        <img onClick={props.handleClick} src={photo.link} alt={`Photo ${index}`} style={{ maxHeight: '29vh' }} />
                        <Checkbox checked={props.selectedImages.includes(photo)} onChange={(e) => handleSelect(e, photo)} ></Checkbox>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EcographImages;


const style = {
    photoContainer: {
        display: 'flex',
        overflowX: 'scroll',
        height: '35vh',
        width: '100%',
    }
}