import { Checkbox } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { NewVisitContext } from "../Model/NewVisitContext";


const EcographImages = (props) => {

    const [selectedImages, setSelectedImages] = useState([]);

    const handleSelect = (e, photo) => {
        setSelectedImages(prevSelectedImages => {
            if (e.target.checked) {
                return [...prevSelectedImages, photo];
            } else {
                return prevSelectedImages.filter(selectedImage => selectedImage !== photo);
            }
        });
    };

    useEffect(() => {
        props.joint.joint.setImages(selectedImages);
        props.joint.setJoint(props.joint.joint);
    }, [selectedImages]);


    return (
        <div className="photo-gallery">
            <div style={style.photoContainer} className="photo-container">
                {props.photos.map((photo, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', margin: '0 10px' }}>
                        <img onClick={props.handleClick} src={photo.link} alt={`Photo ${index}`} style={{ maxHeight: '31vh' }} />
                        <Checkbox onChange={(e) => handleSelect(e, photo)} ></Checkbox>
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