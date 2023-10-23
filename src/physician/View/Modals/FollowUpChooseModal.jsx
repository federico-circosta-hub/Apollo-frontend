import React from "react";
import { Button, Modal } from "react-bootstrap/";
import { Alert, AlertTitle, Backdrop } from "@mui/material";
import VisitLine from "../OtherComponents/VisitLine";
import { useContext, useState } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";

export default function FollowUpChooseModal(props) {
  const { newVisit } = useContext(NewVisitContext);

  const [showModal, setShowModal] = useState(true);
  const [chooseError, setChooseError] = useState(false);

  const handleSelect = (v) => {
    if (new Date(v.date) > newVisit.visitDate) {
      setChooseError(true);
      return;
    }
    props.onChoose(v);
    setShowModal(false);
  };

  return (
    <Modal show={showModal} animation={true} size={"lg"}>
      <Alert severity="info" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Scegliere la visita</AlertTitle>
      </Alert>

      <Modal.Body style={{ background: "whitesmoke" }}>
        <table className="table table-primary table-striped table-hover">
          <thead
            style={{
              position: "sticky",
              top: 0,
              height: "6vh",
            }}
          >
            <tr style={{}}>
              {/* <th style={{ background: "white", width: "15%" }}>Id visita</th> */}
              <th style={{ background: "white", width: "40%" }}>Data</th>
              <th style={{ background: "white", width: "25%" }}>Medico</th>
              <th style={{ background: "white", width: "35%" }}>Tipo visita</th>
            </tr>
          </thead>

          <tbody>
            {newVisit.previousVisitList
              .filter((e) => e.physician !== null)
              .map((visit, index) => (
                <VisitLine
                  key={index}
                  visit={visit}
                  onSelectVisit={() => {
                    handleSelect(visit);
                  }}
                />
              ))}
          </tbody>
        </table>
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
          onClick={() => props.onCancel()}
        >
          Annulla
        </button>
      </Modal.Footer>
      {chooseError && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={chooseError}
          onClick={() => setChooseError(false)}
        >
          <Alert
            severity="warning"
            variant="filled"
            style={{ width: "80%", justifyContent: "center", fontSize: 22 }}
          >
            <AlertTitle style={{ fontSize: 22 }}>
              Non è consentito selezionare una data di follow-up successiva alla
              data della visita che si sta compilando
            </AlertTitle>
          </Alert>
        </Backdrop>
      )}
    </Modal>
  );
}
