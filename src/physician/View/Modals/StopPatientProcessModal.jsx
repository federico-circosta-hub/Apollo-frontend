import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap/";
import { Link } from "react-router-dom";
import { PatientContext } from "../../Model/PatientContext";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import { Alert, AlertTitle } from "@mui/material";
import { StepContext } from "../../Model/StepContext";

const StopPatientProcessModal = ({ show }) => {
  const { setNewVisit } = useContext(NewVisitContext);
  const { setCurrentJoint } = useContext(CurrentJointContext);
  const { selectedPatient, setSelectedPatient } = useContext(PatientContext);
  const { setCompletedStep } = useContext(StepContext);

  return (
    <Modal show={show.showModal} animation={true}>
      <Alert severity="error" variant="filled" style={{ width: "100%" }}>
        <AlertTitle style={{ fontSize: 23 }}>
          Sei sicuro di voler terminare con{" "}
          {selectedPatient != null && selectedPatient.gender == "M"
            ? "il"
            : "la"}{" "}
          paziente {selectedPatient != null ? selectedPatient.name : ""}{" "}
          {selectedPatient != null ? selectedPatient.surname : ""}?
        </AlertTitle>
      </Alert>

      <Modal.Body
        style={{
          background: "whitesmoke",
          fontSize: 20,
        }}
      >
        L'eventuale visita non completata verrà eliminata
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
          to={"/"}
          className="btn btn-danger btn-lg"
          onClick={() => {
            setSelectedPatient(null);
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
