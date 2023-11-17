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
import nameChecker from "../../ViewModel/NameChecker";
import { HelpOutlineOutlined, QuestionMarkOutlined } from "@mui/icons-material";

export default function ExpostVisitServiceModal(props) {
  const { selectedPatient } = useContext(PatientContext);
  const VISITS_AT_TIME = 20;
  const [visitListP, setVisitListP] = useState([]);
  const [visitList, setVisitList] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [loadingOtherVisits, setLoadingOtherVisits] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedVisit, setSelectedVisit] = useState();
  const [merging, setMerging] = useState(false);
  const [offset, setOffset] = useState(0);
  const [patientOffset, setPatientOffset] = useState(0);
  const [endReached, setEndReached] = useState(false);
  const [patientEndReached, setPatientEndReached] = useState(false);
  const throttledScrollP = React.useRef(null);
  const throttledScroll = React.useRef(null);
  useEffect(() => {
    getVisitsByPatient(0);
    getVisits(0);
  }, []);

  useEffect(() => {
    if (visitListP.length === 0 && patientEndReached) setPage(1);
  }, [patientEndReached]);

  const getVisitsByPatient = async (offsetParam) => {
    offsetParam === 0 ? setLoadingVisits(true) : setLoadingOtherVisits(true);
    setNetworkError(null);
    try {
      let visitsArray = await CommunicationController.get("visit/mediaOnly", {
        patient: selectedPatient.pid,
        offset: offsetParam,
        cnt: VISITS_AT_TIME,
      });
      console.log(visitsArray);
      setPatientOffset(offsetParam);
      if (visitsArray.length < VISITS_AT_TIME) setPatientEndReached(true);
      let updatedVisits = [];
      for (let e of visitsArray) {
        e.deanonymizedPatient =
          selectedPatient.name + " " + selectedPatient.surname;
        e.birthdate = selectedPatient.birthdate;
        e.gender = selectedPatient.gender;
        updatedVisits.push(e);
      }
      setVisitListP((prevState) => [...prevState, ...updatedVisits]);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingVisits(false);
      setLoadingOtherVisits(false);
    }
  };

  const getVisits = async (offsetParam) => {
    setLoadingOtherVisits(true);
    setNetworkError(null);
    try {
      let visitsArray = await CommunicationController.get("visit/mediaOnly", {
        offset: offsetParam,
        cnt: VISITS_AT_TIME,
      });
      setOffset(offsetParam);
      if (visitsArray.length < VISITS_AT_TIME) setEndReached(true);
      console.log(visitsArray);
      for (let e of visitsArray) {
        if (e.patient === selectedPatient.pid) continue;
        try {
          let patient = await DeanonymizedCC.get("patient", {
            pid: e.patient,
          });
          patient = patient[0];
          e.deanonymizedPatient = patient.name + " " + patient.surname;
          e.birthdate = patient.birthdate;
          e.gender = patient.gender;
        } catch (patientError) {
          console.log("errore visita", e.id);
          e.deanonymizedPatient = null;
        }
        setVisitList((prevState) => [...prevState, e]);
      }
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingOtherVisits(false);
    }
  };

  const handleScroll = React.useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (!endReached && (scrollTop + clientHeight) / scrollHeight >= 0.85) {
      if (!throttledScroll.current) {
        throttledScroll.current = setTimeout(() => {
          getVisits(offset + VISITS_AT_TIME);
          throttledScroll.current = null;
        }, 750);
      }
    }
  });

  const handleScrollP = React.useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      !patientEndReached &&
      (scrollTop + clientHeight) / scrollHeight >= 0.85
    ) {
      if (!throttledScrollP.current) {
        throttledScrollP.current = setTimeout(() => {
          getVisitsByPatient(patientOffset + VISITS_AT_TIME);
          throttledScrollP.current = null;
        }, 750);
      }
    }
  });

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

  return page === 0 ? (
    <Modal show={page == 0} animation={true} size={"lg"} scrollable={true}>
      <Alert severity="info" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Scegliere la visita da compilare</AlertTitle>
      </Alert>

      <Modal.Body
        style={{ background: "whitesmoke", height: "40vh" }}
        onScroll={handleScrollP}
      >
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
          visitListP !== null &&
          visitListP.length !== 0 && (
            <table className="table table-primary table-striped table-hover">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  height: "6vh",
                }}
              >
                <tr style={{}}>
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
                {visitListP
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
                      <td>{nameChecker(visit.deanonymizedPatient)}</td>
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
        {loadingOtherVisits && <CircularProgress />}
        {visitListP.length === 0 && (
          <p style={{ textAlign: "center", fontSize: 20 }}>
            <em>Non sono presenti visite</em>
          </p>
        )}
        {endReached && (
          <p style={{ textAlign: "center", fontSize: 20 }}>
            <em>Non sono presenti altre visite</em>
          </p>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          background: "whitesmoke",
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => props.onCancel()}
          >
            Annulla
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "right" }}>
          <button className="btn btn-warning" onClick={() => setPage(1)}>
            Visita non presente <HelpOutlineOutlined />
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  ) : page === 1 ? (
    <Modal show={page === 1} animation={true} size={"lg"} scrollable={true}>
      <Alert severity="warning" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>
          {visitListP.length === 0 ? (
            <>
              Nessuna visita per {nameChecker(selectedPatient.name)}{" "}
              {nameChecker(selectedPatient.surname)}, controlla tra queste:{" "}
            </>
          ) : (
            "Controlla tra queste:"
          )}
        </AlertTitle>
      </Alert>

      <Modal.Body
        style={{ background: "whitesmoke", height: "40vh" }}
        onScroll={handleScroll}
      >
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
        {networkError === null &&
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
                      <td>{nameChecker(visit.deanonymizedPatient)}</td>
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
        {loadingOtherVisits && <CircularProgress />}
        {visitList.length === 0 && (
          <p style={{ textAlign: "center", fontSize: 20 }}>
            <em>Non sono presenti visite</em>
          </p>
        )}
        {endReached && !loadingOtherVisits && (
          <p style={{ textAlign: "center", fontSize: 20 }}>
            <em>Non sono presenti altre visite</em>
          </p>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          background: "whitesmoke",
          width: "100%",
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
          Associa visita selezionata a {nameChecker(selectedPatient.name)}{" "}
          {nameChecker(selectedPatient.surname)}
        </AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke", fontSize: 21 }}>
        La visita selezionata appartiene{" "}
        {selectedVisit.gender == "M" ? "al" : "alla"} paziente{" "}
        {selectedVisit.deanonymizedPatient}, confermando, tutte le visite a{" "}
        {selectedVisit.gender == "M" ? "lui" : "lei"} associate verranno
        attribuite a {nameChecker(selectedPatient.name)}{" "}
        {nameChecker(selectedPatient.surname)}
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
