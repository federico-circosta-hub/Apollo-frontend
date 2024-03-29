import { useContext, useEffect, useState, useRef } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import "dayjs/locale/it";
import { useNavigate } from "react-router-dom";
import EcographImages from "../OtherComponents/EcographImages";
import { Modal } from "react-bootstrap";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import JointVisitQuestions from "../OtherComponents/JointVisitQuestions";
import FormModal from "../Modals/FormModal";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import { validateForm } from "../../ViewModel/Validation";
import format from "date-fns/format";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import { Alert, AlertTitle, Button, CircularProgress } from "@mui/material";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import VisitMerger from "../Modals/VisitMerger";

export default function Joint(props) {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { selectedPatient } = useContext(PatientContext);
  const { currentJoint, setCurrentJoint } = useContext(CurrentJointContext);

  const buttonCancel = useRef(null);
  const buttonSave = useRef(null);

  const [joint, setJoint] = useState(null);
  const [photos, setPhotos] = useState(newVisit.ecographies);
  const [ids, setIds] = useState(newVisit.ecographiesId);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [errors, setErrors] = useState({ none: "none" });
  const [loadingImages, setLoadingImages] = useState(false);
  const [isThereNewImage, setIsThereNewImage] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [displayMerger, setDisplayMerger] = useState(false);
  const [networkErrorIndex, setNetworkErrorIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadJoint();
    if (photos.length === 0) {
      getNewImages();
    }
  }, []);

  useEffect(() => {
    if (props.isCancelButtonActive) cancel();
    if (props.isForwardButtonActive) saveAndForward();
  }, [props.isCancelButtonActive, props.isForwardButtonActive]);

  const cancel = () => {
    let photosModified = [...photos];
    photosModified.forEach((e) => {
      if (e.actualModified.value && e.actualModified.select === true) {
        e.realJoint = undefined;
        e.realSide = undefined;
      } else if (e.actualModified.value && e.actualModified.select === false) {
        e.realJoint = currentJoint.name;
        e.realSide = currentJoint.side;
      }
    });
    setPhotos(photosModified);
    newVisit.setEcographies(photos);
    newVisit.setEcographiesId(ids);
    setJoint(null);
    setCurrentJoint(null);
    setNewVisit(newVisit);
    props.setCancelButtonActive(false);
    navigate("/newVisit/jointSelection", { replace: true });
  };
  const saveAndForward = () => {
    setJoint(joint);
    let e = validateForm("jointVisit", joint, newVisit);
    if (Object.keys(e).length == 0) {
      if (
        newVisit.jointPresence({
          name: joint.jointName,
          side: joint.side,
        })
      ) {
        newVisit.deleteJointForUpdate({
          name: joint.jointName,
          side: joint.side,
        });
      }
      newVisit.addJoint(joint);
      newVisit.setEcographies(photos);
      newVisit.setEcographiesId(ids);
      setNewVisit(newVisit);
      setCurrentJoint(null);
      console.log(newVisit);
      props.setForwardButtonActive(false);
      navigate("/newVisit/jointSelection", { replace: true });
    } else {
      setErrors(e);
      setFormModal(true);
    }
  };

  const getNewImages = async () => {
    setNetworkError(null);
    setLoadingImages(true);
    let params = {
      patient: selectedPatient.pid,
      date: format(newVisit.visitDate, "y-MM-dd"),
      exclude: ids,
    };
    try {
      const idsObject = await CommunicationController.get(
        "visit/media",
        params
      );
      const idsFromServer = [...idsObject.imgs, ...idsObject.videos];
      console.log(idsFromServer);
      if (idsFromServer.length > 0) {
        setIsThereNewImage(true);
        const fetchImagePromises = idsFromServer.map(async (e) => {
          try {
            let params = { id: e };
            if (idsObject.videos.includes(e)) {
              params.videoFormat = "mp4";
            }
            let eco = await CommunicationController.get("media/base64", params);
            if (eco && Object.keys(eco).length > 0) {
              eco.realJoint = undefined;
              eco.realSide = undefined;
              eco.actualModified = { value: false, select: null };
              setPhotos((prevState) => [...prevState, eco]);
            }
            console.log("ottenuta eco:", eco);
            setIds((prevState) => [...prevState, e]);
          } catch (error) {
            console.error("Errore durante il recupero dell'immagine:", error);
            //if (!error.response) getNewImages();
          }
        });
        await Promise.all(fetchImagePromises);
      } else {
        setIsThereNewImage(false);
        setTimeout(() => {
          setIsThereNewImage(null);
        }, 4000);
      }
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
      if (!err.response) getNewImages();
    } finally {
      setLoadingImages(false);
    }
  };

  const loadJoint = async () => {
    let j = await newVisit.getJoint(currentJoint);
    setJoint(j);
  };

  const openModal = (id) => {
    setCurrentPhoto(id);
    setShowPhotoModal(true);
  };

  const setJointFieldInPhotos = (id, joint, scan) => {
    let newPhotos = photos;
    newPhotos.forEach((e) => {
      if (e.id === id) {
        e.joint = joint;
        e.scan = scan;
      }
    });
    setPhotos(newPhotos);
  };

  return selectedPatient ? (
    <div>
      <div className="box-bianco" style={style.box}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "95%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
            }}
          >
            <div
              style={{
                overflow: "auto",
                height: "85vh",
                width: "100%",
                textAlign: "center",
                border: "1px solid #dcdcdc",
                boxShadow: "1px 2px 6px #dcdcdc",
                borderRadius: "20px",
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                  background: "white",
                  borderStartsaveAndForwardRadius: "20px",
                  borderStartStartRadius: "20px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <RefreshButton
                    onClick={() => {
                      getNewImages();
                    }}
                    loading={loadingImages}
                  />
                  {newVisit.isInPresence && (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => setDisplayMerger(true)}
                      style={{ margin: "10px" }}
                      endIcon={<HelpOutlineOutlinedIcon />}
                    >
                      No ecografie
                    </Button>
                  )}
                </div>

                {isThereNewImage === false && (
                  <Alert
                    severity="warning"
                    variant="outlined"
                    style={{ width: "100%" }}
                  >
                    <AlertTitle>Nessuna nuova ecografia</AlertTitle>
                  </Alert>
                )}

                {joint === null && <CircularProgress />}
                {networkError !== null &&
                  networkError.response === undefined && (
                    <Alert
                      severity="error"
                      variant="filled"
                      style={{ width: "100%" }}
                    >
                      <AlertTitle>Errore di rete, riprovare</AlertTitle>
                    </Alert>
                  )}
                {networkError !== null &&
                  networkError.response !== undefined &&
                  networkError.response.data.message ===
                    "Error: visit does not exist" && (
                    <Alert
                      severity="error"
                      variant="filled"
                      style={{ width: "100%" }}
                    >
                      <AlertTitle>Non ci sono ecografie</AlertTitle>
                    </Alert>
                  )}
              </div>
              {joint && photos && (
                <EcographImages
                  handleClick={(e) => openModal(e)}
                  photos={photos}
                  setPhotos={setPhotos}
                  joint={{ joint, setJoint }}
                  loadingImages={loadingImages}
                  setLoadingImages={setLoadingImages}
                  networkError={networkError}
                  setJointField={setJointFieldInPhotos}
                />
              )}
              {photos !== null &&
                photos.length === 0 &&
                !loadingImages &&
                networkError === null && (
                  <Alert
                    severity="error"
                    variant="filled"
                    style={{ width: "100%" }}
                  >
                    Nessuna ecografia
                  </Alert>
                )}
            </div>
            {displayMerger && (
              <VisitMerger show={displayMerger} setShow={setDisplayMerger} />
            )}
          </div>

          <div style={{ height: "85vh", flex: 2 }}>
            {joint !== null ? (
              <JointVisitQuestions
                joint={joint}
                setJoint={setJoint}
                networkErrorIndex={networkErrorIndex}
                setNetworkErrorIndex={setNetworkErrorIndex}
              />
            ) : (
              "Caricamento..."
            )}
          </div>
        </div>

        <div
          style={{
            display: "none",
            justifyContent: "space-between",
            width: "95%",
            alignItems: "center",
          }}
        >
          <div>
            <button
              ref={buttonCancel}
              to={"/newVisit/jointSelection"}
              style={style.forwardButton}
              className="btn btn-danger btn-lg"
              onClick={() => {
                cancel();
              }}
            >
              Annulla
            </button>
          </div>
          <div>
            <button
              ref={buttonSave}
              disabled={networkErrorIndex}
              style={style.forwardButton}
              className="btn btn-success btn-lg"
              onClick={() => {
                saveAndForward();
              }}
            >
              Salva
            </button>
          </div>
        </div>
      </div>
      <Modal
        fullscreen={true}
        show={showPhotoModal}
        onHide={() => setShowPhotoModal(false)}
        centered
      >
        <Modal.Body>
          {currentPhoto &&
            photos.find((e) => e.id === currentPhoto).type === "video" && (
              <video
                width={"100%"}
                controls
                onClick={() => {
                  setShowPhotoModal(false);
                  setCurrentPhoto(null);
                }}
              >
                <source
                  src={photos.find((e) => e.id === currentPhoto).base64}
                  type="video/mp4"
                />
              </video>
            )}
          {currentPhoto &&
            photos.find((e) => e.id === currentPhoto).type === "image" && (
              <img
                src={photos.find((e) => e.id === currentPhoto).base64}
                alt={"Ecografia " + currentJoint.name + " " + currentJoint.side}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
                onClick={() => {
                  setShowPhotoModal(false);
                  setCurrentPhoto(null);
                }}
              />
            )}
        </Modal.Body>
      </Modal>
      <div>
        {formModal && (
          <FormModal
            formModal={formModal}
            setFormModal={setFormModal}
            errors={errors}
          />
        )}
      </div>
    </div>
  ) : (
    <NoContextModal what={" un paziente "} service={" nuova articolazione "} />
  );
}

const style = {
  buttons: {
    width: "47%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "right",
    justifyContent: "space-around",
    marginBottom: "5%",
    border: "1px solid black",
    borderRadius: "20px",
    padding: "4%",
  },

  box: {
    width: "98%",
    height: "89vh",
    borderRadius: "15px",
    background: "white",
    margin: "auto",
    marginTop: "0.5%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "1.5%",
    paddingBottom: "1.5%",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "grey",
    width: "60%",
    borderRadius: 15,
    margin: 0,
  },
};
