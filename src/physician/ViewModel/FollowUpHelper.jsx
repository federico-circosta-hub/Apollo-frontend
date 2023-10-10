import { useState, useContext } from "react";
import eye from "../img/icon/view.png";
import format from "date-fns/format";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { VisitContext } from "../Model/VisitContext";
import { NewVisitContext } from "../Model/NewVisitContext";

export default function FollowUpHelper(props) {
  const { setSelectedVisit } = useContext(VisitContext);

  const previousVisitDate = new Date(props.previousVisit.date);

  function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  const checkDate = () => {
    let d = dateDiffInDays(previousVisitDate, new Date());
    console.log(
      format(previousVisitDate, "dd-MM-y"),
      format(new Date(), "dd-MM-y"),
      d > 30
    );
    return d > 30;
  };

  const [showModal, setShowModal] = useState(checkDate());

  return !showModal ? (
    <div style={{ display: "flex", width: "100%", gap: "1%" }}>
      <Link
        onClick={() => {
          setSelectedVisit(props.previousVisit);
          props.seeVisit();
        }}
        to={"/seeVisit"}
        className="btn btn-info"
      >
        <img width={22} src={eye} alt="" /> {"Visualizza visita "}
        {format(previousVisitDate, "dd-MM-y")}
      </Link>
    </div>
  ) : (
    <Modal show={showModal} animation={true}>
      <Modal.Header>
        <Modal.Title>Confermare visita di follow up?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          La data dell'ultima visita è antecedente i 30 giorni,{" "}
          {format(previousVisitDate, "dd-MM-y")}
          <br />
          confermi che l'attuale visita sia di follow up?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowModal(false);
            props.onCancel();
          }}
        >
          Annulla
        </button>
        <button className="btn btn-success" onClick={() => setShowModal(false)}>
          Conferma
        </button>
      </Modal.Footer>
    </Modal>
  );
}
