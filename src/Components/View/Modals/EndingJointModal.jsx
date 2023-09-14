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
                <Link to={'/newVisit/drug'} class="btn btn-success btn-lg" onClick={() => console.log(objectData)}>
                    Prosegui
                </Link>
            </Modal.Footer>
        </Modal>
    );
};

export default EndingJointModal;
