import { Checkbox } from "@mui/material";
import { useState } from "react";
import { Skeleton, CircularProgress } from "@mui/material";

const EcographImages = (props) => {
  const handleSelect = (e, photo) => {
    const index = props.photos.findIndex((p) => p.id === photo.id);
    let newPhotos = props.photos;
    if (e.target.checked) {
      newPhotos[index].realJoint = props.joint.joint.jointName;
      newPhotos[index].realSide = props.joint.joint.side;
    } else {
      newPhotos[index].realJoint = undefined;
      newPhotos[index].realSide = undefined;
    }
    props.setPhotos(newPhotos);
  };

  return (
    <div className="photo-gallery">
      <div style={style.photoContainer} className="photo-container">
        {props.loadingImages && (
          <div>
            <Skeleton
              style={{ margin: "2%" }}
              variant="rectangular"
              width={"95%"}
              height={"30vh"}
            />
            <Skeleton
              style={{ margin: "2%" }}
              variant="rectangular"
              width={"95%"}
              height={"30vh"}
            />
            <Skeleton
              style={{ margin: "2%" }}
              variant="rectangular"
              width={"95%"}
              height={"30vh"}
            />
            <Skeleton
              style={{ margin: "2%" }}
              variant="rectangular"
              width={"95%"}
              height={"30vh"}
            />
          </div>
        )}
        {props.photos.map((photo, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              margin: 2,
              background: props.photos
                .filter(
                  (p) =>
                    p.realJoint === props.joint.joint.jointName &&
                    p.realSide === props.joint.joint.side
                )
                .includes(photo)
                ? "#90ee90"
                : "",
              borderRadius: "5px",
            }}
          >
            <img
              onLoad={() => {
                props.setLoadingImages(false);
              }}
              onClick={props.handleClick}
              src={photo.base64}
              alt={`Photo ${index}`}
              width={"100%"}
              style={{ borderRadius: "5px" }}
            />
            <Checkbox
              checked={props.photos
                .filter(
                  (p) =>
                    p.realJoint === props.joint.joint.jointName &&
                    p.realSide === props.joint.joint.side
                )
                .includes(photo)}
              onChange={(e) => handleSelect(e, photo)}
            ></Checkbox>
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
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
  },
};
