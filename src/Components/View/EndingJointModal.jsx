import React from 'react';
import { Button, Modal } from 'react-bootstrap/';
import { Link } from 'react-router-dom';

const Keys = ['patient', 'visitDate', 'physicalActivity', 'traumaticEvent', 'joints']

const EndingJointModal = ({ objectData, show }) => {


    const renderFields = () => {
        return Keys.map((key, index) => (
            <div key={index}>
                <strong>{key}:</strong> {objectData.toString(key)}
            </div>
        ));
    };

    const forwardResolver = () => {
        if (objectData.followUp.followUp) {
            return (
                <Link to={'/visit/newVisitInPresence/followUp'} class="btn btn-warning btn-lg" onClick={() => console.log(objectData)}>
                    Procedi
                </Link>
            )
        } else {
            return (
                <Link to={'/visit/newVisitInPresence/drug'} class="btn btn-success btn-lg" onClick={() => console.log(objectData)}>
                    Procedi
                </Link>
            )
        }
    }


    return (
        <Modal show={show.showEndingModal} animation={true}>
            <Modal.Header >
                <Modal.Title>Dettagli visita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderFields()}
            </Modal.Body>
            <Modal.Footer>
                <button class="btn btn-secondary btn-lg" onClick={() => show.setShowEndingModal(false)}>
                    Annulla
                </button>
                {forwardResolver()}
            </Modal.Footer>
        </Modal>
    );
};

export default EndingJointModal;
