import { Link, useNavigate } from "react-router-dom";
import search from "../../img/icon/search.png";
import add from "../../img/icon/add-user.png";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { PatientContext } from "../../Model/PatientContext";
import PatientLine from "../OtherComponents/PatientLine";
import DeanonymizedCC from "../../../common/Model/Communication/DeanonymizedCommunicationController";
import FakeSecurityModule from "./../../Model/FakeSecurityModule";
import MainContainer from "../../../common/View/MainContainer";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import { SkeletonsList } from "../OtherComponents/SkeletonsList";
import ModifyPatientModal from "../Modals/ModifyPatientModal";

export default function SearchPatient() {
  const PATIENTS_AT_TIME = 10;
  const [patientListToShow, setPatientListToShow] = useState([]);
  const [loadingFirstPatients, setLoadingFirstPatients] = useState(false);
  const [loadingOtherPatients, setLoadingOtherPatients] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [endReached, setEndReached] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [disable, setDisable] = useState(false);
  const [patientToMod, setPatientToMod] = useState(null);

  const navigate = useNavigate();

  const { selectedPatient, setSelectedPatient } = useContext(PatientContext);

  useEffect(() => {
    getPatients();
  }, []);

  const clearAll = () => {
    setPatientListToShow([]);
    setNetworkError(null);
  };

  const getPatients = async () => {
    try {
      let patients = await DeanonymizedCC.get("patient", {
        cnt: PATIENTS_AT_TIME,
        offset: offset,
      });
      if (patients.length === 0 || patients.length < PATIENTS_AT_TIME)
        setEndReached(true);
      if (patients.length > 0) {
        console.log(patients);
        setPatientListToShow((prevState) => [...prevState, ...patients]);
        setOffset(offset + PATIENTS_AT_TIME);
      }
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingFirstPatients(false);
      setLoadingOtherPatients(false);
    }
  };

  const handleSelect = () => {
    setTimeout(() => {
      navigate("/searchVisit");
    }, 200);
  };

  const handleResearch = async (e) => {
    setSearchInput(e.target.value);
    setOffset(0);
    clearAll();
  };

  const researchPatients = debounce(async () => {
    setDisable(true);
    setLoadingFirstPatients(true);
    try {
      let patients = await DeanonymizedCC.get("patient", {
        cnt: PATIENTS_AT_TIME,
        offset: offset,
        search: searchInput,
      });
      if (patients.length === 0 || patients.length < PATIENTS_AT_TIME)
        setEndReached(true);
      if (patients.length > 0) {
        console.log(patients);
        setPatientListToShow(patients);
        setOffset(offset + PATIENTS_AT_TIME);
      }
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setDisable(false);
      setLoadingFirstPatients(false);
      setLoadingOtherPatients(false);
    }
  }, 2000);

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (!endReached && (scrollTop + clientHeight) / scrollHeight >= 0.9) {
      setLoadingOtherPatients(true);
      getPatients();
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <MainContainer>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            gap: "1vw",
          }}
        >
          <img src={search} width={30} height={30} />
          <input
            style={{ width: "65%", fontSize: 24 }}
            type="text"
            name="name"
            placeholder="cerca per nome o cognome..."
            /*             onChange={handleResearch} */
            value={searchInput}
            disabled={disable}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingLeft: "1%",
            }}
          >
            <div>
              <Link
                to={"/newPatient"}
                className="btn btn-primary"
                style={{ fontSize: 24 }}
              >
                Nuovo paziente{" "}
                <img
                  src={add}
                  alt="search"
                  width={40}
                  style={{ filter: `invert(100%)` }}
                />
              </Link>
            </div>
          </div>
        </div>

        <div
          onScroll={handleScroll}
          style={{
            width: "100%",
            height: "72vh",
            overflow: "auto",
            textAlign:
              loadingFirstPatients || networkError !== null ? "center" : "left",
            borderRadius: "15px",
            border: "0.5px solid #56AEC9",
            boxShadow: "1px 2px 6px #56AEC9",
          }}
        >
          {loadingFirstPatients && <SkeletonsList />}
          {networkError !== null && (
            <div style={{ marginTop: "1%" }}>
              Errore nell'ottenere lista pazienti
              <RefreshButton
                onClick={() => {
                  getPatients();
                  console.log(networkError);
                }}
              />
            </div>
          )}
          {!loadingFirstPatients &&
            networkError === null &&
            patientListToShow.length > 0 && (
              <table className="table table-primary table-striped table-hover">
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    height: "6vh",
                    textAlign: "center",
                  }}
                >
                  <tr>
                    <th style={{ background: "white" }}>CF</th>
                    <th style={{ background: "white" }}>Cognome</th>
                    <th style={{ background: "white" }}>Nome</th>
                    <th style={{ background: "white" }}>Data di nascita</th>
                  </tr>
                </thead>
                <tbody onScroll={handleScroll} style={{ textAlign: "center" }}>
                  {patientListToShow.map((patient, index) => (
                    <PatientLine
                      key={index}
                      patient={patient}
                      isSelected={patient === selectedPatient}
                      onMod={setPatientToMod}
                      onSelectPatient={() => {
                        setSelectedPatient(patient);
                        handleSelect();
                      }}
                    />
                  ))}
                </tbody>
              </table>
            )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {loadingOtherPatients && <CircularProgress />}
          </div>
          {endReached && (
            <tfoot
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              <em>Non sono presenti altri pazienti</em>
            </tfoot>
          )}
        </div>
        {patientToMod !== null && (
          <ModifyPatientModal
            patient={patientToMod}
            setPatient={setPatientToMod}
          />
        )}
      </MainContainer>
    </div>
  );
}
