import { Modal, } from "react-bootstrap"
import { Link } from "react-router-dom";

export default function NoContextModal(props) {

    return (
        <Modal show={true} animation={true}>
            <Modal.Header >
                <Modal.Title>Attenzione!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Scegliere <strong>{props.what}</strong> per utilizzare il servizio di <strong>{props.service}</strong></p>
            </Modal.Body>
            <Modal.Footer>
                <Link class="btn btn-warning" to={'/'} >
                    Ok
                </Link>
            </Modal.Footer>
        </Modal>
    )
}