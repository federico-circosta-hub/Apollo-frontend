import { useState, useContext } from "react";
import GenerateVisits from "../Model/GenerateVisits";
import format from "date-fns/format";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { VisitContext } from "../Model/VisitContext";

export default function FollowUpHelper(props) {

    function dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    const checkDate = () => {
        let d = dateDiffInDays(dates[0], new Date())
        console.log(format(dates[0], 'dd-MM-y'), format(new Date(), 'dd-MM-y'), d > 30)
        return d > 30
    }

    const [dates, setDates] = useState(GenerateVisits())
    //const [visible, setVisible] = useState(false)
    const [showModal, setShowModal] = useState(checkDate())

    const { setSelectedVisit } = useContext(VisitContext);


    return !showModal ? (
        <Link onClick={() => setSelectedVisit(dates[0])} to={'/visit/seeVisit'} class="btn btn-info">Visualizza ultima visita del {format(dates[0], 'dd-MM-y')}</Link>
    )
        :
        (
            <Modal show={showModal} animation={true}>
                {console.log(dates)}
                <Modal.Header >
                    <Modal.Title>Confermare visita di follow up?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        La data dell'ultima visita è antecedente i 30 giorni, {format(dates[0], 'dd-MM-y')}
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