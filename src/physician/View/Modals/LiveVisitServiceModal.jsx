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
import itLocale from "date-fns/locale/it";

export default function LiveVisitServiceModal(props) {
  const MAX_VISITS = 50;
  const { selectedPatient } = useContext(PatientContext);

  const [visitList, setVisitList] = useState(null);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedVisit, setSelectedVisit] = useState();
  const [merging, setMerging] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkVisit();
  }, []);

  const checkVisit = async () => {
    setChecking(true);
    setNetworkError(null);
    try {
      let visit = await CommunicationController.get("visit/incompleted", {
        patient: selectedPatient.pid,
        date: new Date(),
      });
      setSelectedVisit(visit);
      props.onCreate(true, visit.id, visit.date);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setChecking(false);
    }
  };

  const getVisits = async () => {
    setLoadingVisits(true);
    setNetworkError(null);
    let params = {
      cnt: MAX_VISITS,
      date: new Date(),
    };
    try {
      let visitsArray = await CommunicationController.get(
        "visit/incompleted",
        params
      );
      if (visitsArray.length > 0) {
        for (let e of visitsArray) {
          let patient = await DeanonymizedCC.get("patient", {
            pid: e.patient,
          });
          patient = patient[0];
          e.deanonymizedPatient = patient.name + " " + patient.surname;
          e.birthdate = patient.birthdate;
          e.gender = patient.gender;
        }
      }
      setVisitList(visitsArray);
      console.log(visitsArray);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
      console.error(err);
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleSelect = (v) => {
    setSelectedVisit(v);
    if (
      v.deanonymizedPatient ==
      selectedPatient.name + " " + selectedPatient.surname
    )
      props.onCreate(true, v.id, v.date);
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

  const handleError = () => {
    getVisits();
    setPage(1);
  };

  if (page === 0) {
    return (
      <Modal show={page == 0} animation={true} size={"lg"} scrollable>
        {checking && (
          <Alert
            severity="info"
            variant="filled"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AlertTitle style={{ fontSize: 23 }}>
              Recuperando la visita live...
            </AlertTitle>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress sx={{ color: "white" }} />
            </div>
          </Alert>
        )}
        {networkError && handleError()}
      </Modal>
    );
  } else if (page === 1) {
    return (
      <Modal show={page == 1} animation={true} size={"lg"}>
        <Alert severity="error" variant="filled" style={{ width: "100%" }}>
          <AlertTitle style={{ fontSize: 25 }}>
            Attenzione! Non esiste una visita in corso con{" "}
            {selectedPatient.gender == "M" ? "il" : "la"} paziente{" "}
            {selectedPatient.name} {selectedPatient.surname}
          </AlertTitle>
        </Alert>
        <Alert
          severity="error"
          variant="outlined"
          style={{ width: "100%", background: "whitesmoke" }}
        >
          <p style={{ fontSize: 19 }}>
            - esportare le immagini dell'ecografo e assicurarsi del suo corretto
            funzionamento
          </p>
          <p style={{ fontSize: 17 }}>
            <em>oppure</em>
          </p>
          <p style={{ fontSize: 19 }}>
            - Verificare la presenza della visita di riferimento qui sotto
          </p>
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
          {visitList && visitList.length === 0 && !networkError && (
            <p style={{ textAlign: "center" }}>
              <em>
                Non sono presenti visite live alla data di oggi{" "}
                {format(new Date(), "cccc d MMMM y", {
                  locale: itLocale,
                })}
              </em>
            </p>
          )}
          {!loadingVisits &&
            !networkError &&
            visitList &&
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
                    .filter((e) => e.patient !== "iYHoCDJzYxvw5kDNB42rkX")
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
    );
  } else {
    return (
      <Modal show={page == 2} animation={true} size={"lg"}>
        <Alert severity="warning" variant="filled" style={{ width: "100%" }}>
          <AlertTitle style={{ fontSize: 25 }}>
            Associa visita selezionata a {selectedPatient.name}{" "}
            {selectedPatient.surname}
          </AlertTitle>
        </Alert>
        <Modal.Body style={{ background: "whitesmoke", fontSize: 21 }}>
          La visita selezionata appartiene{" "}
          {selectedPatient.gender == "M" ? "al" : "alla"} paziente{" "}
          {selectedVisit.deanonymizedPatient}, confermando, tutte le visite a{" "}
          {selectedVisit.gender == "M" ? "lui" : "lei"} associate verranno
          attribuite a {selectedPatient.name} {selectedPatient.surname}
          <br />
          <br />
          <strong>
            <em>
              Se durante la visita occorre usare nuovamente l'ecografo
              ricordarsi di esportare con il nome corretto:{" "}
              {selectedPatient.name} {selectedPatient.surname}
            </em>
          </strong>
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
            </Alert>
          )}
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => setPage(1)}
          >
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
}
