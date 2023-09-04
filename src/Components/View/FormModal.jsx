import { Modal, } from "react-bootstrap"

export default function FormModal(props) {

    const errors = props.errors

    const displayErrors = () => {
        return (
            Object.values(errors).map((element, index) => (
                <p key={index}>{element}</p>
            ))
        )
    }

    return (
        <Modal show={props.formModal} animation={true}>
            <Modal.Header >
                <Modal.Title>Attention! Correct the fields</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {displayErrors()}
            </Modal.Body>

            <Modal.Footer>
                <button class="btn btn-warning" onClick={() => props.setFormModal(false)}>
                    Okay
                </button>
            </Modal.Footer>
        </Modal>
    )
}