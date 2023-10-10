import { Modal } from "react-bootstrap";
import { PatientContext } from "../../Model/PatientContext";
import { useContext, useState } from "react";
import { Alert, AlertTitle } from "@mui/material";

export default function NoPreviousVisit(props) {
  const { selectedPatient } = useContext(PatientContext);

  const [show, setShow] = useState(true);

  return (
    <Modal show={show} animation={true}>
      <Alert severity="warning" variant="filled" style={{ width: "100%" }}>
        <AlertTitle style={{ fontSize: 23 }}>Attenzione!</AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke", fontSize: 20 }}>
        <p>
          {selectedPatient.gender === "M" ? "Il" : "La"} paziente{" "}
          {selectedPatient.name} {selectedPatient.surname} non ha visite
          precedenti
        </p>
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          background: "whitesmoke",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            props.setIsFollowUp();
            setShow(false);
          }}
        >
          Ok
        </button>
      </Modal.Footer>
    </Modal>
  );
}
