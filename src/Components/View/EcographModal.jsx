import { Modal, } from "react-bootstrap"
import { Link } from "react-router-dom";

export default function EcographModal(props) {

    return (
        <Modal style={{}} show={props.showModal} animation={true}>
            <Modal.Header style={{ background: '#ffd700' }}>
                <Modal.Title>Attention!</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: '#ffd700' }}>
                <p>Please export images from the ecograph before continue</p>
            </Modal.Body>
            <Modal.Footer style={{ background: '#ffd700' }}>
                <Link class="btn btn-success" to={'/visit/newVisitInPresence/jointSelection/joint'} >
                    I've exported images yet
                </Link>
                <button class="btn btn-danger" onClick={() => (props.setShowModal(false))} >
                    Back
                </button>
            </Modal.Footer>

        </Modal>
    )
}