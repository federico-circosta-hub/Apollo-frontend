import { useContext, useEffect, useState } from "react";
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
import { Alert, AlertTitle, Button } from "@mui/material";
import { Skeletons } from "../OtherComponents/Skeletons";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import VisitMerger from "../Modals/VisitMerger";

export default function Joint(props) {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { selectedPatient } = useContext(PatientContext);
  const { currentJoint, setCurrentJoint } = useContext(CurrentJointContext);

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
    if (newVisit.ecographies.length === 0) {
      getNewImages();
    }
  }, []);

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
      const idsFromServer = await CommunicationController.get(
        "media/visit/img",
        params
      );
      console.log(idsFromServer);
      if (idsFromServer.length > 0) {
        setIsThereNewImage(true);
        console.log(idsFromServer);
        await idsFromServer.forEach(async (e) => {
          let eco = await CommunicationController.get("media", {
            id: e,
          });
          console.log("eco appena arrivata", eco, typeof eco);
          if (eco && Object.keys(eco).length > 0) {
            eco.realJoint = undefined;
            eco.realSide = undefined;
            eco.actualModified = { value: false, select: null };
            console.log("ottenuta eco:", eco);
            setPhotos((prevState) => [...prevState, eco]);
          }
          setIds((prevState) => [...prevState, e]);
        });
      } else {
        setIsThereNewImage(false);
        setTimeout(() => {
          setIsThereNewImage(null);
        }, 4000);
      }
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
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
                {loadingImages && <Skeletons />}
                {joint === null && "Caricamento..."}
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
              {joint !== null && !loadingImages && photos !== null && (
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

          <div style={{ height: "78vh", flex: 2 }}>
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
          <img
            src={
              currentPhoto !== null
                ? photos.find((e) => e.id === currentPhoto).base64
                : null
            }
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
