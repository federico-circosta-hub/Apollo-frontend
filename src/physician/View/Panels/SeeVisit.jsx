import { useContext, useState, useEffect, useRef } from "react";
import { VisitContext } from "../../Model/VisitContext";
import { Alert, Snackbar } from "@mui/material";
import NoContextModal from "../Modals/NoContextModal";
import print from "./../../img/icon/print.png";
import copy from "./../../img/icon/copy.png";
import { useNavigate } from "react-router-dom";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import MainContainer from "../../../common/View/MainContainer";
import VisitInfo from "../OtherComponents/SeeVisit/VisitInfo";
import JointInfo from "../OtherComponents/SeeVisit/JointInfo";
import JointNameChanger from "../../ViewModel/JointNameChanger";
import { CircularProgress } from "@mui/material";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import MyDocument from "../../ViewModel/PdfCreator";
import { useReactToPrint } from "react-to-print";
import { PatientContext } from "../../Model/PatientContext";
import NewVisitModel from "../../Model/NewVisitModel";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Typography, Popover, Button } from "@mui/material";

export default function SeeVisit() {
  const { selectedVisit } = useContext(VisitContext);
  const { selectedPatient } = useContext(PatientContext);
  const [visit, setVisit] = useState(null);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [selectedJoint, setSelectedJoint] = useState(null);
  const [networkErrorF, setNetworkErrorF] = useState(null);
  const [frequencies, setFrequencies] = useState();
  const [loadingFreq, setLoadingFreq] = useState(false);
  const [visitToPrint, setVisitToPrint] = useState(null);
  const [distensionCauseValues, setDistensionCauseValues] = useState([]);
  const [loadingCauses, setLoadingCauses] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [prevVisit, setPrevVisit] = useState();
  const [tempDisplay, setTempDisplay] = useState("none");

  useEffect(() => {
    loadVisit();
    getFrequenciesFromServer();
    getDistensionCauseValuesFromServer();
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const componentRef = useRef();

  const handleclick = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleCopy = () => {
    const range = document.createRange();
    range.selectNode(componentRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    setTimeout(() => {
      setTempDisplay("none");
    }, 1500);
  };

  const transformVisit = (v) => {
    let nvtp = new NewVisitModel();
    v.report.joints.forEach((e) => nvtp.addJoint(e));
    nvtp.setVisitDate(new Date(v.date));
    setVisitToPrint(nvtp);
  };

  const loadVisit = async () => {
    setNetworkError(null);
    setLoadingVisit(true);
    try {
      const visitObject = await CommunicationController.get("visit/details", {
        id: selectedVisit.id,
      });
      loadPrevVisit(visitObject);
      console.log(visitObject);
      setVisit(visitObject);
      transformVisit(visitObject);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingVisit(false);
    }
  };

  const loadPrevVisit = async (v) => {
    if (!v.follows) return;
    let params = {
      patient: selectedPatient.pid,
      id: v.follows,
    };
    try {
      const pv = await CommunicationController.get("visit", params);
      setPrevVisit(pv);
    } catch (err) {
      console.log(err);
    }
  };

  const getFrequenciesFromServer = async () => {
    setLoadingFreq(true);
    setNetworkErrorF(null);
    try {
      const f = await CommunicationController.get("drug/frequency", {});
      setFrequencies(f);
    } catch (err) {
      setNetworkErrorF(err || "Errore inatteso");
    } finally {
      setLoadingFreq(false);
    }
  };

  const getDistensionCauseValuesFromServer = async () => {
    setLoadingCauses(true);
    try {
      const dcv = await CommunicationController.get("distensionReason", {});
      setDistensionCauseValues(dcv);
    } catch (err) {
    } finally {
      setLoadingCauses(false);
    }
  };

  const handleJointSelection = (j) => {
    setSelectedJoint(null);
    setSelectedJoint(j);
  };

  const navigate = useNavigate();

  return selectedVisit !== null ? (
    <MainContainer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 0,
      }}
    >
      {loadingVisit && visit === null && (
        <div style={{ display: "flex", marginTop: "5%" }}>
          <CircularProgress />
        </div>
      )}
      {networkError !== null && (
        <div style={{ marginTop: "5%" }}>
          Errore nell'ottenere la visita
          <RefreshButton
            onClick={() => {
              loadVisit();
            }}
          />
        </div>
      )}
      {!loadingVisit && visit !== null && networkError === null && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              background: selectedJoint !== null ? "#87cefa" : "#4682b4",
              width: "100%",
              height: "6vh",
              alignItems: "center",
              borderStartEndRadius: "15px",
              borderStartStartRadius: "15px",
            }}
          >
            <h2 style={{ color: "white" }}>
              {selectedJoint !== null
                ? "Dettagli articolazione"
                : "Dettagli visita"}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                width: "25%",
                border:
                  selectedJoint !== null
                    ? "0.5px solid #87cefa"
                    : "0.5px solid #4682b4",
                boxShadow:
                  selectedJoint !== null
                    ? "2px 2px 4px #87cefa"
                    : "2px 2px 4px #4682b4",
                borderRadius: 15,
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "2vh",
                  background: selectedJoint === null ? "#4682b4" : "white",
                  borderRadius: 15,
                }}
              >
                <button
                  onClick={() => setSelectedJoint(null)}
                  className={
                    selectedJoint != null
                      ? "btn btn-lg btn-primary"
                      : "btn btn-lg btn-light"
                  }
                >
                  Dettagli visita
                </button>
              </div>
              {visit !== null &&
                visit.report.joints.length > 0 &&
                visit.report.joints.map((item, index) => (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      textAlign: "center",
                      alignItems: "center",
                      paddingTop: "2vh",
                      paddingBottom: "2vh",
                      background: selectedJoint == item ? "#87cefa" : "white",
                      borderRadius: 15,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {item.prothesis && (
                        <div>
                          <Button onClick={handleClick}>
                            <ErrorOutlineOutlinedIcon />
                          </Button>
                          <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            <Typography sx={{ p: 2 }}>
                              Articolazione con protesi
                            </Typography>
                          </Popover>
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 4 }}>
                      <button
                        onClick={() => handleJointSelection(item)}
                        className={
                          selectedJoint != item
                            ? "btn btn-lg btn-primary"
                            : "btn btn-lg btn-light"
                        }
                        key={index}
                      >
                        {JointNameChanger.fromSeparateEnglishToSingleStringIta(
                          item.name,
                          item.side
                        )}
                      </button>
                    </div>
                    <div style={{ flex: 1 }}></div>
                  </div>
                ))}
            </div>

            <div
              style={{
                overflow: "auto",
                width: "70%",
                textAlign: "center",
                height: "68vh",
                border:
                  selectedJoint !== null
                    ? "0.5px solid #87cefa"
                    : "0.5px solid #4682b4",
                boxShadow:
                  selectedJoint !== null
                    ? "2px 2px 4px #87cefa"
                    : "2px 2px 4px #4682b4",
                padding: "1.5%",
                borderRadius: 15,
              }}
            >
              <div>
                {selectedJoint !== null && (
                  <JointInfo
                    visit={visit}
                    selectedJoint={selectedJoint}
                    distensionCauseValues={distensionCauseValues}
                    loadingCauses={loadingCauses}
                    get={getDistensionCauseValuesFromServer}
                  />
                )}

                {visit !== null && selectedJoint === null && (
                  <VisitInfo
                    visit={visit}
                    frequencies={frequencies}
                    networkErrorF={networkErrorF}
                    getFrequenciesFromServer={getFrequenciesFromServer}
                    prevVisit={prevVisit}
                  />
                )}
                {visit === null && selectedJoint === null && (
                  <CircularProgress />
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              marginBottom: "1%",
              display: "flex",
              justifyContent: "center",
              gap: "5vw",
            }}
          >
            <button
              style={{ fontSize: 24 }}
              className="btn btn-danger btn"
              onClick={() => {
                navigate(-1);
              }}
            >
              Chiudi
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "5vw",
              }}
            >
              {visitToPrint ? (
                <>
                  <button
                    className="btn btn-success btn-lg"
                    onClick={() => {
                      setTempDisplay("flex");
                      setTimeout(() => {
                        handleCopy();
                      }, 100);
                    }}
                  >
                    <div>
                      Copia report HEAD-US{" "}
                      <img
                        src={copy}
                        alt="copy"
                        width={38}
                        height={38}
                        style={{ filter: "invert(100%" }}
                      />
                    </div>
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      handleclick();
                    }}
                  >
                    <div>
                      Stampa report HEAD-US{" "}
                      <img
                        src={print}
                        alt="save or print"
                        width={38}
                        height={38}
                        style={{ filter: "invert(100%" }}
                      />
                    </div>
                  </button>
                </>
              ) : (
                <CircularProgress />
              )}
            </div>
            <Snackbar
              open={tempDisplay !== "none"}
              autoHideDuration={1500}
              anchorOrigin={{
                open: tempDisplay === "none",
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
                HEAD-US copiato!
              </Alert>
            </Snackbar>
          </div>

          <div
            style={{
              display: tempDisplay,
              position: "absolute",
              margin: "auto",
            }}
          >
            {visitToPrint && (
              <MyDocument
                patient={selectedPatient}
                visit={visitToPrint}
                ref={componentRef}
              />
            )}
          </div>
        </>
      )}
    </MainContainer>
  ) : (
    <NoContextModal
      what={" paziente e relativa visita "}
      service={" visualizzazione visita passata"}
    />
  );
}
