import { Modal, Button } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import format from "date-fns/format";
import documentSend from "../../img/icon/document-send.png";
import { Link } from "react-router-dom";
import JointNameChanger from "../../ViewModel/JointNameChanger";
import nameChecker from "../../ViewModel/NameChecker";
import { useState } from "react";

export default function EndingVisitModal(props) {
  const [selectedJoint, setSelectedJoint] = useState(null);

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
            <AlertTitle>Visita conclusa con successo!</AlertTitle>
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
            {props.sending ? "Concludendo... " : "Concludi "}
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
            <AlertTitle>Errore durante la conclusione</AlertTitle>
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
            {props.sending ? "Concludendo..." : "Riprova"}
          </button>
        </Modal.Footer>
      );
    }
  };

  return (
    <Modal show={props.showModal} animation={true} scrollable={true} fullscreen>
      <Modal.Header style={{ background: "#f0f8ff" }}>
        <Modal.Title>Confermare conclusione visita</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: "60vh",
          display: "flex",
          gap: "3vw",
          background: "whitesmoke",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "100%",
            flex: 1,
            display: "flex",
            background: "whitesmoke",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          {" "}
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
        </div>

        <div
          style={{
            height: "100%",
            display: "flex",
            flex: 1,
            background: "whitesmoke",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              top: "0",
              zIndex: "1",
              background: "white",
              borderRadius: 5,
              overflowY: "scroll",
              marginBottom: 10,
              padding: 10,
              height: "30vh",
            }}
          >
            {props.visit.joints.length > 0 ? (
              props.visit.joints.map((e) => {
                return (
                  <button
                    style={{ margin: 5 }}
                    className="btn btn-primary"
                    onClick={() => setSelectedJoint(e)}
                  >
                    {JointNameChanger.fromSeparateEnglishToSingleStringIta(
                      e.jointName,
                      e.side
                    )}
                  </button>
                );
              })
            ) : (
              <p>
                <em>Nessuna articolazione visitata</em>
              </p>
            )}
          </div>
          <div>
            {selectedJoint && (
              <button
                className="btn btn-warning"
                onClick={() => setSelectedJoint(null)}
              >
                Ecografie non utilizzate
              </button>
            )}
          </div>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            flex: 1,
            background: "whitesmoke",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <h5>
            {selectedJoint ? (
              <>
                Ecografie{" "}
                {JointNameChanger.fromSeparateEnglishToSingleStringIta(
                  selectedJoint.jointName,
                  selectedJoint.side
                )}{" "}
              </>
            ) : (
              <> Ecografie non utilizzate: </>
            )}
          </h5>
          <div
            style={{
              // position: "sticky",
              top: "0",
              zIndex: "1",
              background: "white",
              borderRadius: "20px",
              overflowY: "scroll",
            }}
          >
            {selectedJoint ? (
              <div
                style={{
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {" "}
                {props.visit.ecographies
                  .filter(
                    (e) =>
                      e.realJoint === selectedJoint.jointName &&
                      e.realSide === selectedJoint.side
                  )
                  .map((item, index) => (
                    <>
                      {item.type === "image" && (
                        <img
                          key={index}
                          src={item.base64}
                          style={{ width: "100%", margin: 5 }}
                        />
                      )}
                      {item.type === "video" && (
                        <video
                          key={index}
                          loop
                          autoPlay
                          controls="true"
                          muted
                          width="100%"
                          height="100%"
                          src={item.base64}
                          type="video/mp4"
                        ></video>
                      )}
                    </>
                  ))}
              </div>
            ) : (
              <div
                style={{
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {props.visit.ecographies.filter((e) => !e.realJoint).length ===
                  0 && (
                  <p>
                    <em>Nessuna ecografia scartata</em>
                  </p>
                )}
                {props.visit.ecographies
                  .filter((e) => !e.realJoint)
                  .map((item, index) => (
                    <>
                      {item.type === "image" && (
                        <img
                          key={index}
                          src={item.base64}
                          style={{ width: "100%", margin: 5 }}
                        />
                      )}
                      {item.type === "video" && (
                        <video
                          key={index}
                          loop
                          autoPlay
                          controls="true"
                          muted
                          width="100%"
                          height="100%"
                          src={item.base64}
                          type="video/mp4"
                        ></video>
                      )}
                    </>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      {footer()}
    </Modal>
  );
}
