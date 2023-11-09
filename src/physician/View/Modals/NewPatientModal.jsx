import { Modal, Button } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import { RefreshButton } from "../OtherComponents/RefreshButton";

export default function NewPatientModal(props) {
  const footer = () => {
    if (props.data.showAlert) {
      return (
        <Alert
          severity="success"
          onClose={() => props.data.navigate("/", { replace: true })}
        >
          <AlertTitle>Paziente aggiunto con successo!</AlertTitle>
          Chiudi per tornare alla <strong>Home</strong>
        </Alert>
      );
    } else if (props.data.showAlert === false) {
      return (
        <Alert
          severity="error"
          onClose={() => {
            props.data.setShowModal(false);
            props.data.setShowAlert(null);
          }}
        >
          <AlertTitle>Errore nell'aggiunta del paziente</AlertTitle>
          <button
            className={
              props.data.disabled
                ? "btn btn-outline-secondary btn-lg"
                : "btn btn-outline-danger btn-lg"
            }
            disabled={props.data.disabled}
            onClick={props.data.handleNew}
          >
            {props.data.disabled ? "Inviando..." : "Riprova"}
          </button>
        </Alert>
      );
    } else {
      return (
        <Modal.Footer style={{ background: "whitesmoke" }}>
          <Button
            disabled={props.data.disabled}
            variant="secondary"
            onClick={() => props.data.setShowModal(false)}
            style={{ fontSize: 24 }}
          >
            Annulla
          </Button>
          <Button
            disabled={props.data.disabled}
            variant="success"
            onClick={props.data.handleNew}
            style={{ fontSize: 24 }}
          >
            {props.data.sendingButton}
          </Button>
        </Modal.Footer>
      );
    }
  };

  return (
    <Modal show={props.data.showModal} animation={true}>
      <Alert severity="info" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Confermare creazione paziente</AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke" }}>
        <p>Nome: {props.data.patient.name}</p>
        <p>Cognome: {props.data.patient.surname}</p>
        <p>
          Codice fiscale:{" "}
          {props.data.patient.CF ? props.data.patient.CF : "N/A"}
        </p>
        <p>
          {props.data.patient.gender === "F" ? "Nata il: " : "Nato il: "}
          {props.data.patient.birthdate}
        </p>
        <p>Genere: {props.data.patient.gender}</p>
        <p>Altezza: {props.data.patient.height}</p>
        <p>Peso: {props.data.patient.weight}</p>
        <p>
          Tipo di emofilia:{" "}
          {props.data.patient.hemophilia
            ? props.data.patient.hemophilia
            : "N/A"}
        </p>
        <p>
          Gravità emofilia:{" "}
          {[0, 1, 2].includes(props.data.patient.hemophilia_gravity)
            ? props.data.patient.hemophilia_gravity === 0
              ? "Lieve"
              : props.data.patient.hemophilia_gravity === 1
              ? "Moderata"
              : props.data.patient.hemophilia_gravity === 2
              ? "Grave"
              : "N/A"
            : "N/A"}
        </p>
      </Modal.Body>

      {footer()}
    </Modal>
  );
}
