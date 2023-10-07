import { useContext, useEffect, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import "dayjs/locale/it";
import { Link, useNavigate } from "react-router-dom";
import EcographImages from "../OtherComponents/EcographImages";
import GenerateImages from "../../Model/GenerateImages";
import { Modal } from "react-bootstrap";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import JointVisitQuestions from "../OtherComponents/JointVisitQuestions";
import FormModal from "../Modals/FormModal";
import a from "../../img/example_gin/1.jpg";
import b from "../../img/example_gin/2.jpg";
import c from "../../img/example_gin/3.jpg";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import { validateForm } from "../../ViewModel/Validation";
import { Skeleton, CircularProgress } from "@mui/material";
import CommunicationController from "../../../common/Model/CommunicationController";
import { Alert, AlertTitle } from "@mui/material";

export default function Joint(props) {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { selectedPatient } = useContext(PatientContext);
  const { currentJoint, setCurrentJoint } = useContext(CurrentJointContext);

  const [joint, setJoint] = useState(null);
  const [photos, setPhotos] = useState(newVisit.ecographies);
  const [ids, setIds] = useState(newVisit.ecographiesId);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [errors, setErrors] = useState({ none: "none" });
  const [loadingImages, setLoadingImages] = useState(false);
  const [isThereNewImage, setIsThereNewImage] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadJoint();
    getNewImages();
  }, []);

  const cancel = () => {
    newVisit.setEcographies(photos);
    newVisit.setEcographiesId(ids);
    setJoint(null);
    setCurrentJoint(null);
    setNewVisit(newVisit);
    navigate("/newVisit/jointSelection");
  };
  const saveAndForward = () => {
    setJoint(joint);
    let e = validateForm("jointVisit", joint, newVisit);
    console.log(Object.keys(e));
    if (Object.keys(e).length == 0) {
      if (newVisit.jointPresence({ name: joint.jointName, side: joint.side })) {
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
      navigate("/newVisit/jointSelection");
    } else {
      setErrors(e);
      setFormModal(true);
    }
  };

  const getNewImages = async () => {
    setLoadingImages(true);
    try {
      const idsFromServer = await CommunicationController.post("media/visit", {
        patient: selectedPatient.pid,
        date: newVisit.visitDate,
        exclude: ids,
      });
      if (idsFromServer.length > 0) {
        setIsThereNewImage(true);
        console.log(idsFromServer);
        await idsFromServer.forEach(async (e) => {
          let eco = await CommunicationController.get("media", { id: e });
          eco.realJoint = undefined;
          eco.realSide = undefined;
          console.log("ottenuta eco:", eco);
          setPhotos((prevState) => [...prevState, eco]);
          setIds((prevState) => [...prevState, e]);
        });
      } else {
        setIsThereNewImage(false);
        setTimeout(() => {
          setIsThereNewImage(null);
        }, 4000);
      }
    } catch (err) {
      console.log(err);
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingImages(false);
    }
  };

  const loadJoint = async () => {
    let j = await newVisit.getJoint(currentJoint);
    setJoint(j);
  };

  const openModal = (e) => {
    setCurrentPhoto(e.target.__reactProps$sceibgztdz.src);
    setShowPhotoModal(true);
  };

  const setJointFieldInPhotos = (id, joint) => {
    let newPhotos = photos;
    newPhotos.forEach((e) => {
      if (e.id === id) {
        e.joint = joint;
      }
    });
    setPhotos(newPhotos);
  };

  return selectedPatient !== null ? (
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
                height: "78vh",
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
                <RefreshButton
                  onClick={() => {
                    getNewImages();
                  }}
                  loading={loadingImages}
                />
                {isThereNewImage === false && (
                  <Alert
                    severity="warning"
                    variant="outlined"
                    style={{ width: "100%" }}
                  >
                    <AlertTitle>Nessuna nuova ecografia</AlertTitle>
                  </Alert>
                )}
              </div>
              {joint === null && "Caricamento..."}
              {networkError !== null &&
                networkError.response !== undefined &&
                networkError.response.data.message !=
                  "Error: visit does not exist" && (
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
                networkError.response.data.message ==
                  "Error: visit does not exist" && (
                  <Alert
                    severity="error"
                    variant="filled"
                    style={{ width: "100%" }}
                  >
                    <AlertTitle>Non ci sono ecografie</AlertTitle>
                  </Alert>
                )}
              {joint !== null &&
                !loadingImages &&
                networkError === null &&
                photos !== null && (
                  <EcographImages
                    handleClick={(e) => openModal(e)}
                    photos={photos}
                    setPhotos={setPhotos}
                    //unfilteredPhotos={photos}
                    //setUnfilteredPhotos={setPhotos}
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
                networkError === null &&
                "Non ci sono ecografie"}
            </div>
          </div>

          <div style={{ height: "78vh", flex: 2 }}>
            {joint !== null ? (
              <JointVisitQuestions joint={joint} setJoint={setJoint} />
            ) : (
              "Caricamento..."
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "95%",
            alignItems: "center",
          }}
        >
          <div>
            <button
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
          <img
            src={currentPhoto != undefined ? currentPhoto : null}
            alt={"Ecografia " + currentJoint.name + " " + currentJoint.side}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            onClick={() => setShowPhotoModal(false)}
          />
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
    height: "91vh",
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
