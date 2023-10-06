import { useContext } from "react";
import { VisitContext } from "../../../Model/VisitContext";
import format from "date-fns/format";
import it from "date-fns/locale/it";

export default function VisitInfo(props) {
  const { selectedVisit } = useContext(VisitContext);

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <h3>
        Data visita:{" "}
        {format(new Date(selectedVisit.date), "d MMMM y", { locale: it })}
      </h3>
      <br />
      <br />
      <p>Paziente: {selectedVisit.patient}</p>
      <p>Medico: {props.visit.physician}</p>
      <p>Tipo di visita: {props.visit.type}</p>
      <h3>Attività fisica</h3>
      <p>
        Tipo attività fisica:{" "}
        {props.visit.report.exercise !== null
          ? props.visit.report.exercise
          : "/"}
      </p>
      <p>
        Data attività fisica:{" "}
        {props.visit.report.exercise !== null
          ? props.visit.report.date_exercise
          : "/"}
      </p>
      <br />
      <br />

      <h3>Evento traumatico</h3>
      <p>
        Tipo di evento traumatico:{" "}
        {props.visit.report.date_trauma !== null
          ? props.visit.report.trauma_event
          : "/"}
      </p>
      <p>
        Data evento traumatico:{" "}
        {props.visit.report.date_trauma !== null
          ? props.visit.report.date_trauma
          : "/"}
      </p>
      <br />
      <br />

      <h3>Follow-Up</h3>
      <p>
        Follow-Up:{" "}
        {props.visit.report.followUp !== null
          ? props.visit.report.followUp
          : "/"}
      </p>
      {/*         <p>
          Risposta al trattamento:{" "}
          {visit.followUp.followUp ? visit.followUp.treatmentResponse : "/"}
        </p> */}
      {/*         <p>
          Visita precedente:{" "}
          {visit.followUp.followUp
            ? visit.followUp.lastVisit.toDateString()
            : "/"}
        </p> */}
      {/*         <br />
        <br />

        <h3>Necessità di visita di Follow-Up</h3>
        <p>
          Necessità di visita di Follow-Up:{" "}
          {visit.needFollowUp.needFollowUp ? "Sì" : "No"}
        </p>
        <p>
          Data di visita di Follow-Up:{" "}
          {visit.needFollowUp.needFollowUp
            ? visit.needFollowUp.followUpDate.toDateString()
            : "/"}
        </p> */}

      <br />
      <br />
      <h3>Farmaco di profilassi</h3>
      <p>
        Nome farmaco:{" "}
        {props.visit.report.prophylaxis_drug !== null
          ? props.visit.report.prophylaxis_drug
          : "/"}
      </p>
      <p>
        Dose:{" "}
        {props.visit.report.prophylaxis_drug !== null
          ? props.visit.report.prophylaxis_dose
          : "/"}
      </p>
      <p>
        Frequenza:{" "}
        {props.visit.report.prophylaxis_drug !== null
          ? props.visit.report.prophylaxis_frequency
          : "/"}
      </p>

      <br />
      <br />
      <h3>Farmaco acuto</h3>
      <p>
        Nome farmaco:{" "}
        {props.visit.report.acute_drug !== null
          ? props.visit.report.acute_drug
          : "/"}
      </p>
      <p>
        Dose:{" "}
        {props.visit.report.acute_drug !== null
          ? props.visit.report.acute_dose
          : "/"}
      </p>
    </div>
  );
}
