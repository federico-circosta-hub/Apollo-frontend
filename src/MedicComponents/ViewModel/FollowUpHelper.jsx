import { useState, useContext } from "react";
import eye from './../img/icon/view.png'
import format from "date-fns/format";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { VisitContext } from "../Model/VisitContext";
import { NewVisitContext } from "../Model/NewVisitContext";

export default function FollowUpHelper(props) {

    const { setSelectedVisit } = useContext(VisitContext);
    const { newVisit } = useContext(NewVisitContext);

    function dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    const checkDate = () => {
        let d = dateDiffInDays(newVisit.previousVisit, new Date())
        console.log(format(newVisit.previousVisit, 'dd-MM-y'), format(new Date(), 'dd-MM-y'), d > 30)
        return d > 30
    }

    const [showModal, setShowModal] = useState(checkDate())

    return !showModal ? (
        <Link onClick={() => { setSelectedVisit(newVisit.previousVisit); props.seeVisit() }} to={'/visit/seeVisit'} class="btn btn-info"><img width={22} src={eye} alt="" /> {format(newVisit.previousVisit, 'dd-MM-y')}</Link>
    )
        :
        (
            <Modal show={showModal} animation={true}>
                <Modal.Header >
                    <Modal.Title>Confermare visita di follow up?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        La data dell'ultima visita è antecedente i 30 giorni, {format(newVisit.previousVisit, 'dd-MM-y')}
                        <br />
                        confermi che l'attuale visita sia di follow up?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <button class="btn btn-secondary" onClick={() => { setShowModal(false); props.onCancel() }}>
                        Annulla
                    </button>
                    <button class="btn btn-success" onClick={() => setShowModal(false)}>
                        Conferma
                    </button>
                </Modal.Footer>
            </Modal>
        )
}