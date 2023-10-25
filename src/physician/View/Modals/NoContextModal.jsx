import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { useContext } from "react";
import { PatientContext } from "../../Model/PatientContext";
import { NewVisitContext } from "../../Model/NewVisitContext";

export default function NoContextModal(props) {
  const { selectedPatient } = useContext(PatientContext);
  const { newVisit } = useContext(NewVisitContext);

  return (
    <Modal show={true} animation={true}>
      <Alert severity="warning" variant="filled" style={{ width: "100%" }}>
        <AlertTitle style={{ fontSize: 23 }}>Attenzione!</AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke", fontSize: 20 }}>
        {!selectedPatient ? (
          <p>
            Selezionare un <strong>paziente</strong> prima di utilizzare il
            servizio di <strong>{props.service}</strong>
          </p>
        ) : (
          <p>
            Creare una <strong>visita</strong> prima di utilizzare il servizio
            di <strong>{props.service}</strong>
          </p>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          background: "whitesmoke",
        }}
      >
        <Link
          replace
          className="btn btn-primary"
          to={!selectedPatient ? "/" : "/searchVisit"}
        >
          Ok
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
