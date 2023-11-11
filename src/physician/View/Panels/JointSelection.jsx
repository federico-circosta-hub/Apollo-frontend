import { useState, useContext, useEffect } from "react";
import male from "../../img/male.png";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { NewVisitContext } from "../../Model/NewVisitContext";
import JointSelectionButtonVisualizer from "../../ViewModel/JointSelectionButtonVisualizer";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import MainContainer from "../../../common/View/MainContainer";
import { Skeleton } from "@mui/material";
import NoContextModal from "../Modals/NoContextModal";
import HorizontalNonLinearStepper from "../OtherComponents/Stepper";
import { StepContext } from "../../Model/StepContext";
import { PatientContext } from "../../Model/PatientContext";
import format from "date-fns/format";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";

export default function JointSelection() {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { setCurrentJoint } = useContext(CurrentJointContext);
  const { completedStep, setCompletedStep } = useContext(StepContext);
  const { selectedPatient } = useContext(PatientContext);

  const [imgLoaded, setImgLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setImgLoaded(true);
    }, 200);
  }, []);

  const handleJoint = (obj) => {
    newVisit.setCurrentJoint(obj);
    setNewVisit(newVisit);
    setCurrentJoint(obj);
    navigate("/newVisit/jointSelection/joint", { replace: true });
  };

  const deleteJoint = (obj) => {
    newVisit.deleteJoint(obj);
    setNewVisit(newVisit);
  };

  const forward = () => {
    let cs = completedStep;
    cs[1] = true;
    setCompletedStep(cs);
  };

  return (
    <div>
      {!newVisit ? (
        <NoContextModal
          what={" una nuova visita "}
          service={" scelta articolazione "}
        />
      ) : (
        <MainContainer>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "left",
            }}
          >
            <div>
              <h3>Seleziona l'articolazione da visitare:</h3>
            </div>
          </div>

          <div
            className="fascia centrale"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={style.leftButtons}>
              <div>
                {!imgLoaded ? (
                  <Skeleton
                    variant="rectangular"
                    width={210}
                    height={118}
                    sx={{ bgcolor: "whitesmoke" }}
                  />
                ) : (
                  <JointSelectionButtonVisualizer
                    click={() => {
                      handleJoint({ name: "elbow", side: "RIGHT" });
                    }}
                    deleteJoint={() =>
                      deleteJoint({ name: "elbow", side: "RIGHT" })
                    }
                    name={"Gomito dx"}
                    nameAndSide={{ name: "elbow", side: "RIGHT" }}
                  />
                )}
              </div>
              <div>
                {!imgLoaded ? (
                  <Skeleton
                    variant="rectangular"
                    width={210}
                    height={118}
                    sx={{ bgcolor: "whitesmoke" }}
                  />
                ) : (
                  <JointSelectionButtonVisualizer
                    click={() => handleJoint({ name: "knee", side: "RIGHT" })}
                    deleteJoint={() =>
                      deleteJoint({ name: "knee", side: "RIGHT" })
                    }
                    name={"Ginocchio dx"}
                    nameAndSide={{ name: "knee", side: "RIGHT" }}
                  />
                )}
              </div>
              <div>
                {!imgLoaded ? (
                  <Skeleton
                    variant="rectangular"
                    width={210}
                    height={118}
                    sx={{ bgcolor: "whitesmoke" }}
                  />
                ) : (
                  <JointSelectionButtonVisualizer
                    click={() => handleJoint({ name: "ankle", side: "RIGHT" })}
                    deleteJoint={() =>
                      deleteJoint({ name: "ankle", side: "RIGHT" })
                    }
                    name={"Caviglia dx"}
                    nameAndSide={{ name: "ankle", side: "RIGHT" }}
                  />
                )}
              </div>
            </div>

            <div style={{ width: "30%" }}>
              {!imgLoaded && (
                <Skeleton
                  variant="rectangular"
                  width={"20vw"}
                  height={"60vh"}
                  style={{ margin: "auto" }}
                  sx={{ bgcolor: "whitesmoke" }}
                />
              )}
              <img
                src={male}
                alt="male human silhouette"
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  position: "relative",
                  margin: "auto",
                  display: imgLoaded ? "block" : "none",
                }}
              />
            </div>
            <div style={style.rightButtons}>
              <div>
                {!imgLoaded ? (
                  <Skeleton
                    variant="rectangular"
                    width={210}
                    height={118}
                    sx={{ bgcolor: "whitesmoke" }}
                  />
                ) : (
                  <JointSelectionButtonVisualizer
                    click={() => handleJoint({ name: "elbow", side: "LEFT" })}
                    deleteJoint={() =>
                      deleteJoint({ name: "elbow", side: "LEFT" })
                    }
                    name={"Gomito sx"}
                    nameAndSide={{ name: "elbow", side: "LEFT" }}
                  />
                )}
              </div>
              <div>
                {!imgLoaded ? (
                  <Skeleton
                    variant="rectangular"
                    width={210}
                    height={118}
                    sx={{ bgcolor: "whitesmoke" }}
                  />
                ) : (
                  <JointSelectionButtonVisualizer
                    click={() => handleJoint({ name: "knee", side: "LEFT" })}
                    deleteJoint={() =>
                      deleteJoint({ name: "knee", side: "LEFT" })
                    }
                    name={"Ginocchio sx"}
                    nameAndSide={{ name: "knee", side: "LEFT" }}
                  />
                )}
              </div>
              <div>
                {!imgLoaded ? (
                  <Skeleton
                    variant="rectangular"
                    width={210}
                    height={118}
                    sx={{ bgcolor: "whitesmoke" }}
                  />
                ) : (
                  <JointSelectionButtonVisualizer
                    click={() => handleJoint({ name: "ankle", side: "LEFT" })}
                    deleteJoint={() =>
                      deleteJoint({ name: "ankle", side: "LEFT" })
                    }
                    name={"Caviglia sx"}
                    nameAndSide={{ name: "ankle", side: "LEFT" }}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              bottom: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "91%",
            }}
          >
            <div>
              <Link
                replace
                className="btn btn-primary"
                to={"/newVisit/"}
                style={{ fontSize: 24 }}
              >
                Indietro
              </Link>
            </div>
            <HorizontalNonLinearStepper />
            <div>
              <Link
                onClick={() => forward()}
                className="btn btn-success"
                to={"/newVisit/drug"}
                replace
                style={{ fontSize: 24 }}
              >
                Avanti
              </Link>
            </div>
          </div>
        </MainContainer>
      )}
    </div>
  );
}

const style = {
  rightButtons: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "space-between",
    marginTop: "12%",
  },
  leftButtons: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    justifyContent: "space-between",
    marginTop: "12%",
  },
  forwardButton: {
    justifyContent: "right",
    display: "flex",
    marginRight: "1%",
    marginBottom: "1%",
    marginLeft: "auto",
    alignItems: "right",
  },
};
