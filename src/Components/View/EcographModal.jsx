import { Modal, } from "react-bootstrap"
import { Link } from "react-router-dom";

export default function EcographModal(props) {

    return (
        <Modal style={{}} show={props.showModal} animation={true}>
            <Modal.Header style={{ background: '#ffd700' }}>
                <Modal.Title>Attenzione!</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: '#ffd700' }}>
                <p>Esportare le immagini da ecografo prima di proseguire</p>
            </Modal.Body>
            <Modal.Footer style={{ background: '#ffd700' }}>
                <Link class="btn btn-success" to={'/visit/newVisitInPresence/jointSelection/joint'} >
                    Ho esportato le immagini
                </Link>
                <button class="btn btn-danger" onClick={() => (props.setShowModal(false))} >
                    Annulla articolazione
                </button>
            </Modal.Footer>

        </Modal>
    )
}