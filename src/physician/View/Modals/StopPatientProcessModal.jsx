import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap/";
import { Link } from "react-router-dom";
import { PatientContext } from "../../Model/PatientContext";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { CurrentJointContext } from "../../Model/CurrentJointContext";

const StopPatientProcessModal = ({ show }) => {
    const { setNewVisit } = useContext(NewVisitContext);
    const { setCurrentJoint } = useContext(CurrentJointContext);
    const { selectedPatient, setSelectedPatient } = useContext(PatientContext);

    return (
        <Modal show={show.showModal} animation={true}>
            <Modal.Header>
                <Modal.Title>
                    Sei sicuro di voler terminare con{" "}
                    {selectedPatient != null && selectedPatient.gender == "M"
                        ? "il"
                        : "la"}{" "}
                    paziente:{" "}
                    {selectedPatient != null ? selectedPatient.name : ""}{" "}
                    {selectedPatient != null ? selectedPatient.surname : ""}?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Le eventuali modifiche o visite non completate verranno
                eliminate
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => show.setShowModal(false)}
                >
                    Annulla
                </button>
                <Link
                    to={"/"}
                    className="btn btn-danger btn-lg"
                    onClick={() => {
                        setSelectedPatient(null);
                        setNewVisit(null);
                        setCurrentJoint(null);
                        show.setShowModal(false);
                    }}
                >
                    Conferma
                </Link>
            </Modal.Footer>
        </Modal>
    );
};

export default StopPatientProcessModal;
