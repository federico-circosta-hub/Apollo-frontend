import { Modal } from "react-bootstrap";
import { PatientContext } from "../../Model/PatientContext";
import { useContext, useState } from "react";

export default function NoPreviousVisit(props) {

    const { selectedPatient } = useContext(PatientContext);

    const [show, setShow] = useState(true)

    return (
        <Modal show={show} animation={true}>
            <Modal.Header>
                <Modal.Title>Attenzione!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Il paziente {selectedPatient.name} {selectedPatient.surname} non ha visite precedenti
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={() => { props.setIsFollowUp(); setShow(false) }}>
                    Ok
                </button>
            </Modal.Footer>
        </Modal>
    );
}
