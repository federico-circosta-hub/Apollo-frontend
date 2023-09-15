import { Checkbox } from '@mui/material';

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
                    <div key={index} style={{ padding: '10px', display: 'flex', flexDirection: 'column', margin: 2, background: props.selectedImages.includes(photo) ? '#90ee90' : '', borderRadius: '5px' }}>
                        <img onClick={props.handleClick} src={photo.link} alt={`Photo ${index}`} width={'100%'} style={{ borderRadius: '5px' }} />
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
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',


    }
}