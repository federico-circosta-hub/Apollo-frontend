import { Link } from "react-router-dom";
import React from "react";
import { Button, Modal } from "react-bootstrap/";
import JointNameChanger from "./../../ViewModel/JointNameChanger";
import { Alert, AlertTitle } from "@mui/material";

const DeleteJointModal = (props) => {
  return (
    <Modal show={true} animation={true}>
      <Alert severity="error" variant="filled" style={{ width: "100%" }}>
        <AlertTitle style={{ fontSize: 23 }}>Attenzione!</AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke", fontSize: 20 }}>
        Sei sicuro di voler eliminare la visita al{" "}
        {
          props.joint /* JointNameChanger.fromSeparateEnglishToSingleStringIta(
          joint.jointToDelete.name,
          joint.jointToDelete.side
        ) */
        }
        ?
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          background: "whitesmoke",
        }}
      >
        <button className="btn btn-secondary btn-lg" onClick={props.cancel}>
          Annulla
        </button>
        <Link
          replace
          to={"/newVisit/jointSelection"}
          className="btn btn-danger btn-lg"
          onClick={() => props.deleteJoint()}
        >
          Conferma
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteJointModal;
