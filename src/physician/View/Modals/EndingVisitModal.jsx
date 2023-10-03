import { Modal, Button } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import format from "date-fns/format";
import documentSend from "../../img/icon/document-send.png";

export default function EndingVisitModal(props) {
  const footer = () => {
    if (props.showAlert) {
      return (
        <Alert
          severity="success"
          onClose={() => props.navigate("/newVisit/endVisit")}
          variant="filled"
        >
          <AlertTitle>Visita inviata con successo!</AlertTitle>
          Chiudi per ottenere documento <strong>head-us</strong>
        </Alert>
      );
    } else if (props.showAlert === null) {
      return (
        <Modal.Footer
          style={{ display: "flex", justifyContent: "center", gap: "10%" }}
        >
          <Button
            disabled={false}
            variant="secondary"
            onClick={() => props.setShowModal(false)}
            style={{ fontSize: 24 }}
          >
            Annulla
          </Button>
          <Button
            disabled={props.sending}
            variant={props.sending ? "secondary" : "success"}
            onClick={props.sends}
            style={{ fontSize: 24 }}
          >
            {props.sending ? "Inviando... " : "Invia "}
            <img
              src={documentSend}
              alt="document send"
              width={38}
              height={38}
              style={{ filter: "invert(100%)" }}
            />
          </Button>
        </Modal.Footer>
      );
    } else if (!props.showAlert) {
      return (
        <Alert
          severity="warning"
          onClose={() => {
            props.setShowModal(false);
            props.setShowAlert(null);
          }}
          variant="filled"
        >
          <AlertTitle>Errore nell'invio</AlertTitle>
          Chiudi e <strong>riprova</strong>
        </Alert>
      );
    }
  };

  return (
    <Modal show={props.showModal} animation={true} scrollable={true} size="lg">
      <Modal.Header>
        <Modal.Title>Confermare invio visita</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: "whitesmoke" }}>
        <p>Nome: {props.patient.name}</p>
        <p>Cognome: {props.patient.surname}</p>
        <p>
          {props.patient.gender === "F" ? "Nata il: " : "Nato il: "}{" "}
          {format(props.patient.birthdate, "dd-M-y")}
        </p>
        <p>Data visita: {format(props.visit.visitDate, "dd-M-y")}</p>
      </Modal.Body>

      {footer()}
    </Modal>
  );
}
