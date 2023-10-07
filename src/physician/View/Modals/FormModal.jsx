import { Modal } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";

export default function FormModal(props) {
  const errors = props.errors;

  const displayErrors = () => {
    return Object.values(errors).map((element, index) => (
      <p key={index}>{element}</p>
    ));
  };

  return (
    <Modal show={props.formModal} animation={true}>
      {/* <Modal.Header style={{ background: "#ffd700" }}>
        <Modal.Title>Attentione! Ricontrolla i campi</Modal.Title>
      </Modal.Header> */}
      <Alert severity="warning" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Ricontrolla i campi!</AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke" }}>
        {displayErrors()}
      </Modal.Body>

      <Modal.Footer
        style={{
          background: "whitesmoke",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          className="btn btn-primary btn-lg"
          onClick={() => props.setFormModal(false)}
        >
          Ok
        </button>
      </Modal.Footer>
    </Modal>
  );
}
