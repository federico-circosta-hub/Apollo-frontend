import { Link } from "react-router-dom";
import React from "react";
import { Button, Modal } from "react-bootstrap/";
import JointNameChanger from "./../../ViewModel/JointNameChanger";

const DeleteJointModal = (props) => {
  return (
    <Modal show={true} animation={true}>
      <Modal.Header>
        <Modal.Title>Attenzione!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Sei sicuro di voler eliminare la visita al{" "}
        {
          props.joint /* JointNameChanger.fromSeparateEnglishToSingleStringIta(
          joint.jointToDelete.name,
          joint.jointToDelete.side
        ) */
        }
        ?
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary btn-lg" onClick={props.cancel}>
          Annulla
        </button>
        <Link
          to={"/newVisit/jointSelection"}
          className="btn btn-primary btn-lg"
          onClick={() => props.deleteJoint()}
        >
          Prosegui
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteJointModal;
