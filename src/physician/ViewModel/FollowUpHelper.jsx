import { useState, useContext } from "react";
import eye from "../img/icon/view.png";
import format from "date-fns/format";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { VisitContext } from "../Model/VisitContext";
import { NewVisitContext } from "../Model/NewVisitContext";
import { Alert, AlertTitle } from "@mui/material";

export default function FollowUpHelper(props) {
  const { setSelectedVisit } = useContext(VisitContext);

  const previousVisitDate = new Date(props.previousVisit.date);

  function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  const checkDate = () => {
    let d = dateDiffInDays(previousVisitDate, new Date());
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
      <Alert severity="warning" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Confermare visita di follow up</AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke", fontSize: 20 }}>
        <p>
          La data dell'ultima visita è antecedente i 30 giorni,{" "}
          {format(previousVisitDate, "dd-MM-y")}
          <br />
          confermi che l'attuale visita sia di follow up?
        </p>
      </Modal.Body>

      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          background: "whitesmoke",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={() => {
            props.onCancel();
            setShowModal(false);
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
