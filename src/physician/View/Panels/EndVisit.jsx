import { useContext, useRef, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { PatientContext } from "../../Model/PatientContext";
import { Link } from "react-router-dom";
import "dayjs/locale/it";
import MyDocument from "../../ViewModel/PdfCreator";
import { useReactToPrint } from "react-to-print";
import MainContainer from "../../../common/View/MainContainer";
import exit from "./../../img/icon/logout.png";
import print from "./../../img/icon/print.png";
import NoContextModal from "../Modals/NoContextModal";
import { Alert, AlertTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StopPatientProcessModal from "../Modals/StopPatientProcessModal";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

export default function EndVisit() {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { selectedPatient, setSelectedPatient } = useContext(PatientContext);

  const [showModal, setShowModal] = useState(false);

  const componentRef = useRef();
  const navigate = useNavigate();

  const handleclick = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleExit = () => {
    if (newVisit.sended) {
      setNewVisit(null);
      setSelectedPatient(null);
      navigate("/", { replace: true });
    } else {
      setShowModal(true);
    }
  };

  return !newVisit ? (
    <NoContextModal service={" report"} />
  ) : (
    <div>
      <MainContainer>
        <h3>Report</h3>
        {!newVisit.sended && (
          <Alert severity="warning" variant="filled" style={{ width: "30%" }}>
            <AlertTitle style={{ fontSize: 20 }}>Attenzione!</AlertTitle>
            Visita non ancora completata / inviata <br />
            <div
              style={{ margin: 2, background: "white", width: "fit-content" }}
            >
              <Link
                style={{ margin: 2, color: "#ed6c02" }}
                to={"/newVisit"}
                replace
              >
                <KeyboardBackspaceOutlinedIcon />
                Torna alla visita
              </Link>
            </div>
          </Alert>
        )}
        <div
          style={{
            overflow: "auto",
            width: "90%",
            height: "80vh",
            borderRadius: "15px",
            border: "0.5px solid #56AEC9",
            boxShadow: "1px 2px 6px #56AEC9",
            background: "lightgrey",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MyDocument
                patient={selectedPatient}
                visit={newVisit}
                ref={componentRef}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "1.5%",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <div>
            <button className="btn btn-danger btn-lg" onClick={handleExit}>
              Esci{" "}
              <img
                src={exit}
                alt="uscita"
                width={38}
                height={38}
                style={{ filter: "invert(100%" }}
              />
            </button>
          </div>
          <div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                handleclick();
              }}
            >
              <div>
                Stampa{" "}
                <img
                  src={print}
                  alt="save or print"
                  width={38}
                  height={38}
                  style={{ filter: "invert(100%" }}
                />
              </div>
            </button>
          </div>
        </div>
        <StopPatientProcessModal show={{ showModal, setShowModal }} />
      </MainContainer>
    </div>
  );
}
