import { Modal, Button } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import format from "date-fns/format";
import documentSend from "../../img/icon/document-send.png";
import { Link } from "react-router-dom";

export default function EndingVisitModal(props) {
  const footer = () => {
    if (props.showAlert) {
      return (
        <Modal.Footer
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#f0f8ff",
          }}
        >
          <Alert severity="success" variant="filled" style={{ width: "100%" }}>
            <AlertTitle>Visita inviata con successo!</AlertTitle>
          </Alert>
          <Link
            className="btn btn-outline-success btn-lg"
            to={"/newVisit/endVisit"}
          >
            Report
          </Link>
        </Modal.Footer>
      );
    } else if (props.showAlert === null) {
      return (
        <Modal.Footer
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10%",
            background: "#f0f8ff",
          }}
        >
          <Button
            disabled={false}
            variant="primary"
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
        <Modal.Footer
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#f0f8ff",
          }}
        >
          <Alert
            style={{ width: "100%" }}
            severity="warning"
            onClose={() => {
              props.setShowModal(false);
              props.setShowAlert(null);
            }}
            variant="filled"
          >
            <AlertTitle>Errore nell'invio</AlertTitle>
          </Alert>
          <button
            className={
              props.sending
                ? "btn btn-outline-secondary btn-lg"
                : "btn btn-outline-danger btn-lg"
            }
            disabled={props.sending}
            onClick={props.sends}
          >
            {props.sending ? "Inviando..." : "Riprova"}
          </button>
        </Modal.Footer>
      );
    }
  };

  return (
    <Modal show={props.showModal} animation={true} scrollable={true} size="lg">
      <Modal.Header style={{ background: "#f0f8ff" }}>
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
