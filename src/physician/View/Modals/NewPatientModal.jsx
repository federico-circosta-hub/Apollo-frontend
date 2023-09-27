import { Modal, Button } from "react-bootstrap"
import { Alert, AlertTitle } from "@mui/material";

export default function NewPatientModal(props) {


    const footer = () => {
        if (props.data.showAlert) {
            return (
                <Alert severity="success" onClose={() => props.data.navigate("/")}>
                    <AlertTitle>Paziente aggiunto con successo!</AlertTitle>
                    Chiudi per tornare alla <strong>Home</strong>
                </Alert>
            )
        } else {
            return (
                <Modal.Footer>
                    <Button disabled={props.data.disabled} variant="secondary" onClick={() => props.data.setShowModal(false)}>
                        Annulla
                    </Button>
                    <Button disabled={props.data.disabled} variant="success" onClick={props.data.handleNew}>
                        {props.data.sendingButton}
                    </Button>
                </Modal.Footer>
            )
        }
    }

    return (
        <Modal show={props.data.showModal} animation={true}>
            <Modal.Header >
                <Modal.Title>Confermare creazione paziente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Nome: {props.data.patient.name}</p>
                <p>Cognome: {props.data.patient.surname}</p>
                <p>{props.data.patient.gender === 'F' ? 'Nata il: ' : 'Nato il: '}{props.data.patient.birthdate}</p>
                <p>Genere: {props.data.patient.gender}</p>
                <p>Altezza: {props.data.patient.height}</p>
                <p>Peso: {props.data.patient.weight}</p>
                <p>Protesi: {props.data.patient.prothesis.length !== 0 ? props.data.patient.prothesis.toString() : 'nessuna'}</p>
            </Modal.Body>

            {
                footer()
            }

        </Modal>
    )
}