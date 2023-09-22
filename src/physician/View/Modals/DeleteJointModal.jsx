import { Link } from "react-router-dom";
import React from "react";
import { Button, Modal } from "react-bootstrap/";

const DeleteJointModal = ({ joint, deleteJoint }) => {
    return (
        <Modal show={true} animation={true}>
            <Modal.Header>
                <Modal.Title>Attenzione!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Sei sicuro di voler eliminare la visita al {joint.jointToDelete}
                ?
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => joint.setJointToDelete()}
                >
                    Annulla
                </button>
                <Link
                    to={"/newVisit/jointSelection"}
                    className="btn btn-primary btn-lg"
                    onClick={() => deleteJoint()}
                >
                    Prosegui
                </Link>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteJointModal;
