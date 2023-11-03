import { Modal, Button } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import format from "date-fns/format";
import documentSend from "../../img/icon/document-send.png";
import { Link } from "react-router-dom";
import JointNameChanger from "../../ViewModel/JointNameChanger";
import nameChecker from "../../ViewModel/NameChecker";

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
            replace
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
      <Modal.Body
        style={{
          display: "flex",
          background: "whitesmoke",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5>Info generali</h5>
        <p>
          <strong>Nome: </strong>
          {nameChecker(props.patient.name)}
        </p>
        <p>
          <strong>Cognome: </strong>
          {nameChecker(props.patient.surname)}
        </p>
        <p>
          <strong>
            {props.patient.gender === "F" ? "Nata il: " : "Nato il: "}
          </strong>{" "}
          {format(new Date(props.patient.birthdate), "dd-MM-y")}
        </p>
        <p>
          <strong>Data visita: </strong>
          {format(props.visit.visitDate, "dd-MM-y")}
        </p>
        <p>
          <strong>Medico:</strong> {props.visit.physician}
        </p>

        <br />
        <h5>Attività Fisica</h5>
        <p>
          <strong>Tipo:</strong>{" "}
          {props.visit.physicalActivity.physicalActivityType || "N/A"}
        </p>
        <p>
          <strong>Data:</strong>{" "}
          {props.visit.physicalActivity.physicalActivityDate || "N/A"}
        </p>
        <br />
        <h5>Evento Traumatico</h5>
        <p>
          <strong>Tipo:</strong>{" "}
          {props.visit.traumaticEvent.traumaticEvent || "N/A"}
        </p>
        <p>
          <strong>Data:</strong>{" "}
          {props.visit.traumaticEvent.traumaticEventDate || "N/A"}
        </p>

        <br />
        <h5>Follow-Up</h5>

        <p>
          {props.visit.previousVisit !== undefined
            ? format(new Date(props.visit.previousVisit.date), "dd-MM-y")
            : "N/A"}
        </p>
        <br />
        <h5>Farmaco di Profilassi</h5>
        <p>
          <strong>Nome:</strong>{" "}
          {props.visit.prophylacticDrug.drug.name || "N/A"}
        </p>
        <p>
          <strong>Dose:</strong>{" "}
          {Math.round(props.visit.prophylacticDrug.dose) || "N/A"}
        </p>
        <p>
          <strong>Frequenza:</strong>{" "}
          {props.visit.prophylacticDrug.frequency
            ? props.frequencies.find(
                (f) => f.id === props.visit.prophylacticDrug.frequency
              ).frequency
            : "N/A"}
        </p>
        <br />
        <h5>Farmaco Acuto</h5>
        <p>
          <strong>Nome:</strong> {props.visit.acuteDrug.drug.name || "N/A"}
        </p>
        <p>
          <strong>Dose:</strong>{" "}
          {Math.round(props.visit.acuteDrug.dose) || "N/A"}
        </p>

        <br />
        <h5>Aricolazioni visitate</h5>
        {props.visit.joints.length > 0 ? (
          props.visit.joints.map((e) => {
            return (
              <>
                <p>
                  {JointNameChanger.fromSeparateEnglishToSingleStringIta(
                    e.jointName,
                    e.side
                  )}
                </p>
              </>
            );
          })
        ) : (
          <p>
            <em>Nessuna articolazione visitata</em>
          </p>
        )}
      </Modal.Body>

      {footer()}
    </Modal>
  );
}
