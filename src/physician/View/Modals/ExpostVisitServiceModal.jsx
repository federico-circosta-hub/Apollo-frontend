import React from "react";
import { Button, Modal } from "react-bootstrap/";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import VisitLine from "../OtherComponents/VisitLine";
import { useContext, useState, useEffect } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import { SkeletonsList } from "../OtherComponents/SkeletonsList";
import DeanonymizedCC from "../../../common/Model/Communication/DeanonymizedCommunicationController";
import { PatientContext } from "../../Model/PatientContext";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import format from "date-fns/format";

export default function ExpostVisitServiceModal(props) {
  const { selectedPatient } = useContext(PatientContext);

  const [visitList, setVisitList] = useState(null);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedVisit, setSelectedVisit] = useState();
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    getVisits();
  }, []);

  const getVisits = async () => {
    setLoadingVisits(true);
    setNetworkError(null);
    try {
      let visitsArray = await CommunicationController.get(
        "visit/incompleted",
        {}
      );
      let updatedVisits = [];
      for (let e of visitsArray) {
        try {
          let patient = await DeanonymizedCC.get("patient", {
            pid: e.patient,
          });
          patient = patient[0];
          e.deanonymizedPatient = patient.name + " " + patient.surname;
          e.birthdate = patient.birthdate;
          e.gender = patient.gender;
        } catch (patientError) {
          console.error(
            "Errore durante il recupero dei dati del paziente:",
            patientError
          );
          e.deanonymizedPatient = null;
          e.birthdate = null;
          e.gender = null;
        }
        updatedVisits.push(e);
      }
      setVisitList(updatedVisits);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleSelect = (v) => {
    setSelectedVisit(v);
    if (v.patient == selectedPatient.pid) props.onCreate(false, v.id, v.date);
    else setPage(2);
  };

  const mergePatient = async () => {
    setMerging(true);
    try {
      await DeanonymizedCC.patch("patient/merge", {
        oldPatient: selectedVisit.patient,
        newPatient: selectedPatient.pid,
      });
      props.onCreate(false, selectedVisit.id, selectedVisit.date);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setMerging(false);
    }
  };

  return page === 1 ? (
    <Modal show={page == 1} animation={true} size={"lg"} scrollable>
      <Alert severity="info" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Scegliere la visita da compilare</AlertTitle>
      </Alert>

      <Modal.Body style={{ background: "whitesmoke" }}>
        {loadingVisits && <SkeletonsList />}
        {networkError && (
          <div style={{ marginTop: "1%" }}>
            Errore nell'ottenere lista visite
            <RefreshButton
              onClick={() => {
                getVisits();
              }}
            />
          </div>
        )}
        {!loadingVisits &&
          networkError === null &&
          visitList !== null &&
          visitList.length !== 0 && (
            <table className="table table-primary table-striped table-hover">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  height: "6vh",
                }}
              >
                <tr style={{}}>
                  {/* <th style={{ background: "white", width: "15%" }}>
                    Id visita
                  </th> */}
                  <th style={{ background: "white", width: "25%" }}>
                    Data della visita
                  </th>
                  <th style={{ background: "white", width: "35%" }}>
                    Paziente
                  </th>
                  <th style={{ background: "white", width: "25%" }}>
                    Data di nascita
                  </th>
                </tr>
              </thead>

              <tbody>
                {visitList
                  .filter(
                    (e) =>
                      e.patient !== "iYHoCDJzYxvw5kDNB42rkX" &&
                      e.deanonymizedPatient
                  )
                  .map((visit, index) => (
                    <tr
                      className="tr-lg"
                      style={{
                        padding: 30,
                      }}
                      onClick={() => handleSelect(visit)}
                      id={index}
                    >
                      {/* <td>{visit.id}</td> */}
                      <td>{format(new Date(visit.date), "dd-MM-y")}</td>
                      <td>{visit.deanonymizedPatient}</td>
                      <td>
                        {visit.birthdate ? (
                          format(new Date(visit.birthdate), "dd-MM-y")
                        ) : (
                          <em>N/A</em>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          background: "whitesmoke",
        }}
      >
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => props.onCancel()}
        >
          Annulla
        </button>
      </Modal.Footer>
    </Modal>
  ) : (
    <Modal show={page == 2} animation={true} size={"lg"}>
      <Alert severity="warning" variant="filled" style={{ width: "100%" }}>
        <AlertTitle style={{ fontSize: 25 }}>
          Associa visita selezionata a {selectedPatient.name}{" "}
          {selectedPatient.surname}
        </AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke", fontSize: 21 }}>
        La visita selezionata appartiene{" "}
        {selectedVisit.gender == "M" ? "al" : "alla"} paziente{" "}
        {selectedVisit.deanonymizedPatient}, confermando, tutte le visite a{" "}
        {selectedVisit.gender == "M" ? "lui" : "lei"} associate verranno
        attribuite a {selectedPatient.name} {selectedPatient.surname}
      </Modal.Body>

      <Modal.Footer
        style={{
          background: "whitesmoke",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {networkError && (
          <Alert severity="error" variant="filled" style={{ width: "100%" }}>
            <AlertTitle>Errore nell'invio</AlertTitle>
            <em>
              Tenere presente che lo stesso paziente non può avere due visite
              trascitte o live nello stesso giorno
            </em>
          </Alert>
        )}
        <button className="btn btn-secondary btn-lg" onClick={() => setPage(1)}>
          Indietro
        </button>
        {!networkError ? (
          <button
            className="btn btn-primary btn-lg"
            disabled={merging}
            onClick={() => mergePatient()}
          >
            {merging ? "Confermando..." : "Conferma"}
          </button>
        ) : (
          <button
            className="btn btn-danger btn-lg"
            disabled={merging}
            onClick={() => mergePatient()}
          >
            {merging ? "Riprovando..." : "Riprova"}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
