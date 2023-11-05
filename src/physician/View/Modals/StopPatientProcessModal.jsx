import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap/";
import { Link } from "react-router-dom";
import { PatientContext } from "../../Model/PatientContext";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import { Alert, AlertTitle } from "@mui/material";
import { StepContext } from "../../Model/StepContext";
import { PropaneSharp } from "@mui/icons-material";
import nameChecker from "../../ViewModel/NameChecker";

const StopPatientProcessModal = ({ show, home }) => {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { setCurrentJoint } = useContext(CurrentJointContext);
  const { selectedPatient, setSelectedPatient } = useContext(PatientContext);
  const { setCompletedStep } = useContext(StepContext);

  return (
    <Modal show={show.showModal} animation={true}>
      {newVisit && newVisit.sended ? (
        <Alert severity="info" variant="outlined" style={{ width: "100%" }}>
          <AlertTitle style={{ fontSize: 23 }}>
            Sei sicuro di voler terminare con{" "}
            {selectedPatient && selectedPatient.gender == "M" ? "il" : "la"}{" "}
            paziente {selectedPatient ? nameChecker(selectedPatient.name) : ""}{" "}
            {selectedPatient ? nameChecker(selectedPatient.surname) : ""}?
          </AlertTitle>
        </Alert>
      ) : (
        <Alert severity="error" variant="filled" style={{ width: "100%" }}>
          <AlertTitle style={{ fontSize: 23 }}>
            Sei sicuro di voler abbandonare la visita con{" "}
            {selectedPatient && selectedPatient.gender == "M" ? "il" : "la"}{" "}
            paziente {selectedPatient ? nameChecker(selectedPatient.name) : ""}{" "}
            {selectedPatient ? nameChecker(selectedPatient.surname) : ""}?
          </AlertTitle>
        </Alert>
      )}

      <Modal.Body
        style={{
          background: "whitesmoke",
          fontSize: 20,
        }}
      >
        {newVisit && newVisit.sended
          ? "La visita risulta completata, verrai reindirizzato alla home"
          : "La visita non completata verrà eliminata, potrai comunque ricompilarla in un secondo momento"}
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          background: "whitesmoke",
        }}
      >
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => show.setShowModal(false)}
        >
          Annulla
        </button>
        <Link
          replace
          to={home ? "/" : "/searchVisit"}
          className="btn btn-danger btn-lg"
          onClick={() => {
            home && setSelectedPatient(null);
            setNewVisit(null);
            setCurrentJoint(null);
            setCompletedStep({});
            show.setShowModal(false);
          }}
        >
          Conferma
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default StopPatientProcessModal;
