import { useContext, useState, useEffect } from "react";
import { VisitContext } from "../../Model/VisitContext";
import { format } from "date-fns";
import it from "date-fns/locale/it";
import NoContextModal from "../Modals/NoContextModal";
import VisitObjectGenerator from "../../Model/VisitObjectGenerator";
import { useNavigate } from "react-router-dom";
import CommunicationController from "../../../common/Model/CommunicationController";
import MainContainer from "../../../common/View/MainContainer";

export default function SeeVisit() {
  const { selectedVisit } = useContext(VisitContext);
  const [visit, setVisit] = useState(null);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const [selectedJoint, setSelectedJoint] = useState(null);

  useEffect(() => {
    loadVisit();
  }, []);

  const loadVisit = async () => {
    setLoadingVisit(true);
    try {
      const visitObject = await CommunicationController.get("visit/details", {
        id: selectedVisit.id,
      });
      console.log(visitObject);
      setVisit(visitObject);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingVisit(false);
    }
  };

  const jointInfo = () => {
    let jointToDisplay = visit.joints.find(
      (item) => item.jointName == selectedJoint
    );
    return (
      <>
        <h4>{jointToDisplay.jointName}</h4>

        <p>Index Joint: {jointToDisplay.indexJoint ? "Sì" : "No"}</p>
        <p>
          Difficoltà di movimento:{" "}
          {jointToDisplay.jointDifficulty ? "Yes" : "No"}
        </p>
        <p>Dolore: {jointToDisplay.pain ? "Sì" : "No"}</p>
        <p>Ultimo sanguinamento: {jointToDisplay.lastBleed.toDateString()}</p>
        <p>Sinovite: {jointToDisplay.synovitis}</p>
        <p>Cartilagine: {jointToDisplay.articularCartilage}</p>
        <p>Osso subcondrale: {jointToDisplay.subchondralBone}</p>
        <p>Distension: {jointToDisplay.distension}</p>
        <p>Distension cause: {jointToDisplay.distensionCause}</p>
        <p>Ecografie:</p>
        {jointToDisplay.selectedImages.map((item, index) => (
          <img
            key={index}
            src={item.link}
            style={{ width: "100%", margin: 5 }}
          />
        ))}
      </>
    );
  };

  const visitInfo = () => {
    return (
      <div style={{ textAlign: "center", width: "100%" }}>
        <h3>
          Data visita:{" "}
          {format(new Date(selectedVisit.date), "d MMMM y", { locale: it })}
        </h3>
        <br />
        <br />
        <p>Paziente: {selectedVisit.patient}</p>
        <p>Medico: {visit.physician}</p>
        <p>Tipo di visita: {visit.type}</p>
        <h3>Attività fisica</h3>
        <p>
          Tipo attività fisica:{" "}
          {visit.report.exercise !== null ? visit.report.exercise : "/"}
        </p>
        <p>
          Data attività fisica:{" "}
          {visit.report.exercise !== null ? visit.report.date_exercise : "/"}
        </p>
        <br />
        <br />

        <h3>Evento traumatico</h3>
        <p>
          Tipo di evento traumatico:{" "}
          {visit.report.date_trauma !== null ? visit.report.trauma_event : "/"}
        </p>
        <p>
          Data evento traumatico:{" "}
          {visit.report.date_trauma !== null ? visit.report.date_trauma : "/"}
        </p>
        <br />
        <br />

        <h3>Follow-Up</h3>
        <p>
          Follow-Up:{" "}
          {visit.report.followUp !== null ? visit.report.followUp : "/"}
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
          {visit.report.prophylaxis_drug !== null
            ? visit.report.prophylaxis_drug
            : "/"}
        </p>
        <p>
          Dose:{" "}
          {visit.report.prophylaxis_drug !== null
            ? visit.report.prophylaxis_dose
            : "/"}
        </p>
        <p>
          Frequenza:{" "}
          {visit.report.prophylaxis_drug !== null
            ? visit.report.prophylaxis_frequency
            : "/"}
        </p>

        <br />
        <br />
        <h3>Farmaco acuto</h3>
        <p>
          Nome farmaco:{" "}
          {visit.report.acute_drug !== null ? visit.report.acute_drug : "/"}
        </p>
        <p>
          Dose:{" "}
          {visit.report.acute_drug !== null ? visit.report.acute_dose : "/"}
        </p>
      </div>
    );
  };

  const navigate = useNavigate();

  return selectedVisit !== null ? (
    <MainContainer>
      {loadingVisit && visit === null && <h3>Loading...</h3>}
      {!loadingVisit && visit !== null && networkError === null && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              background: selectedJoint !== null ? "#1e90ff" : "#2f4f4f",
              width: "100%",
              height: "5vh",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: "white" }}>
              {selectedJoint !== null
                ? "Dettagli articolazione"
                : "Dettagli visita"}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                width: "25%",
                border: "1px solid lightgray",
                borderRadius: 15,
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "2vh",
                  background: selectedJoint === null ? "#2f4f4f" : "white",
                  borderRadius: 15,
                }}
              >
                <button
                  onClick={() => setSelectedJoint(null)}
                  className={
                    selectedJoint != null
                      ? "btn btn-lg btn-primary"
                      : "btn btn-lg btn-light"
                  }
                >
                  Dettagli visita
                </button>
              </div>
              {/* {joints !== null}
              {visit.joints.map((item, index) => (
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "2vh",
                    background:
                      selectedJoint === item.jointName ? "#1e90ff" : "white",
                    borderRadius: 15,
                  }}
                >
                  <button
                    onClick={() =>
                      selectedJoint !== item.jointName
                        ? setSelectedJoint(item.jointName)
                        : setSelectedJoint(null)
                    }
                    className={
                      selectedJoint != item.jointName
                        ? "btn btn-lg btn-primary"
                        : "btn btn-lg btn-light"
                    }
                    key={index}
                  >
                    {item.jointName}
                  </button>
                </div>
              ))} */}
            </div>

            <div
              style={{
                overflow: "auto",
                width: "70%",
                textAlign: "center",
                height: "75vh",
                border: "1px solid gray",
                padding: "1.5%",
                borderRadius: 15,
              }}
            >
              <div>
                {selectedJoint !== null && visit !== null
                  ? jointInfo()
                  : visitInfo()}
              </div>
            </div>
          </div>
          <div>
            <button
              className="btn btn-danger btn-lg"
              onClick={() => {
                navigate(-1);
              }}
            >
              Chiudi visualizzazione
            </button>
          </div>
        </>
      )}
    </MainContainer>
  ) : (
    <NoContextModal
      what={" paziente e relativa visita "}
      service={" visualizzazione visita passata"}
    />
  );
}
