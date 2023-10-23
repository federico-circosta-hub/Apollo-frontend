import { useContext } from "react";
import { VisitContext } from "../../../Model/VisitContext";
import format from "date-fns/format";
import it from "date-fns/locale/it";
import { RefreshButton } from "../RefreshButton";

export default function VisitInfo(props) {
  const { selectedVisit } = useContext(VisitContext);

  return (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        padding: "5px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={styles.h2}>Data Visita:</h2>
      <p style={{ fontSize: "1.2em", marginBottom: "20px" }}>
        {format(new Date(selectedVisit.date), "d MMMM y", { locale: it })}
      </p>

      <h3 style={styles.h3}>Dettagli Visita:</h3>

      <p>
        <strong>Id medico:</strong> {props.visit.physician}
      </p>
      <p>
        <strong>Tipo di Visita:</strong> {props.visit.type}
      </p>

      <h3 style={styles.h3}>Attività Fisica:</h3>
      <p>
        <strong>Tipo:</strong> {props.visit.report.exercise || "N/A"}
      </p>
      <p>
        <strong>Data:</strong>{" "}
        {props.visit.report.date_exercise
          ? format(new Date(props.visit.report.date_exercise), "y-MM-dd")
          : "N/A"}
      </p>

      <h3 style={styles.h3}>Evento Traumatico:</h3>
      <p>
        <strong>Tipo:</strong> {props.visit.report.trauma_event || "N/A"}
      </p>
      <p>
        <strong>Data:</strong>{" "}
        {props.visit.report.date_trauma
          ? format(new Date(props.visit.report.date_trauma), "y-MM-dd")
          : "N/A"}
      </p>

      <h3 style={styles.h3}>Follow-Up:</h3>
      <p>{props.visit.report.followUp || "N/A"}</p>

      <h3 style={styles.h3}>Farmaco di Profilassi:</h3>
      <p>
        <strong>Nome:</strong> {props.visit.report.prophylaxis_drug || "N/A"}
      </p>
      <p>
        <strong>Dose:</strong>{" "}
        {Math.round(props.visit.report.prophylaxis_dose) || "N/A"}
      </p>
      <p>
        <strong>Frequenza:</strong>{" "}
        {props.networkErrorF ? (
          <>
            Errore nel reperire frequenza
            <RefreshButton onClick={props.getFrequenciesFromServer} />
          </>
        ) : props.frequencies && props.visit.report.prophylaxis_frequency ? (
          props.frequencies.find(
            (f) => f.id === props.visit.report.prophylaxis_frequency
          ).frequency
        ) : (
          "N/A"
        )}
      </p>

      <h3 style={styles.h3}>Farmaco Acuto:</h3>
      <p>
        <strong>Nome:</strong> {props.visit.report.acute_drug || "N/A"}
      </p>
      <p>
        <strong>Dose:</strong>{" "}
        {Math.round(props.visit.report.acute_dose) || "N/A"}
      </p>
    </div>
  );
}

const styles = {
  h3: {
    borderRadius: "5px",
    width: "100%",
    border: "0.5px solid #7cc0d8",
    color: "#4682b4",
    background: "#fcfdff",
  },
  h2: {
    marginBottom: "10px",
    borderRadius: "5px",
    width: "100%",
    border: "0.5px solid #7cc0d8",
    color: "#4682b4",
    background: "#fcfdff",
  },
};
{
  /* <div style={{ textAlign: "center", width: "100%" }}>
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
               <p>
          Risposta al trattamento:{" "}
          {visit.followUp.followUp ? visit.followUp.treatmentResponse : "/"}
        </p> 
               <p>
          Visita precedente:{" "}
          {visit.followUp.followUp
            ? visit.followUp.lastVisit.toDateString()
            : "/"}
        </p> 
               <br />
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
        </p> 

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
    </div> */
}
