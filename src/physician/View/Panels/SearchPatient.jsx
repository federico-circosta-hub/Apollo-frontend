import { Link, useNavigate } from "react-router-dom";
import search from "../../img/icon/search.png";
import add from "../../img/icon/add-user.png";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, useEffect, useState } from "react";
import { PatientContext } from "../../Model/PatientContext";
import PatientLine from "../OtherComponents/PatientLine";
import DeanonymizedCC from "../../../common/Model/Communication/DeanonymizedCommunicationController";
import FakeSecurityModule from "./../../Model/FakeSecurityModule";
import MainContainer from "../../../common/View/MainContainer";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import { SkeletonsList } from "../OtherComponents/SkeletonsList";

export default function SearchPatient() {
    const [patientList, setPatientList] = useState([]);
    const [patientListToShow, setPatientListToShow] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [networkError, setNetworkError] = useState(null);

    const navigate = useNavigate();

    const { selectedPatient, setSelectedPatient } = useContext(PatientContext);

    useEffect(() => {
        getPatients();
    }, []);

    const clearAll = () => {
        setPatientList([]);
        setPatientListToShow([]);
        setNetworkError(null);
    };

    const getPatients = async () => {
        clearAll();
        setLoadingPatients(true);
        try {
            let patients = await DeanonymizedCC.get("patient");
            patients = patients.map((p) => {
                p.birthdate = new Date(p.birthdate);
                return p;
            });
            setPatientListToShow(patients);
            setPatientList(patients);
        } catch (err) {
            setNetworkError(err || "Errore inatteso");
        } finally {
            setLoadingPatients(false);
        }
    };

    const handleSelect = () => {
        setTimeout(() => {
            navigate("/searchVisit");
        }, 200);
    };

    const research = (event) => {
        setPatientListToShow([]);
        let arr = patientList.filter(
            (patient) =>
                patient.surname
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase()) ||
                patient.name
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase())
        );
        setPatientListToShow(arr);
        if (event.target.value === "") setPatientListToShow(patientList);
    };

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
                        onChange={(event) => research(event)}
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
                    style={{
                        width: "100%",
                        height: "72vh",
                        overflow: "auto",
                        textAlign:
                            loadingPatients || networkError !== null
                                ? "center"
                                : "left",
                        borderRadius: "15px",
                        border: "0.5px solid #56AEC9",
                        boxShadow: "1px 2px 6px #56AEC9",
                    }}
                >
                    {loadingPatients && <SkeletonsList />}
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
                    {!loadingPatients &&
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
                                        <th style={{ background: "white" }}>
                                            id
                                        </th>
                                        <th style={{ background: "white" }}>
                                            Cognome
                                        </th>
                                        <th style={{ background: "white" }}>
                                            Nome
                                        </th>
                                        <th style={{ background: "white" }}>
                                            Data di nascita
                                        </th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {patientListToShow.map((patient, index) => (
                                        <PatientLine
                                            key={index}
                                            patient={patient}
                                            isSelected={
                                                patient === selectedPatient
                                            }
                                            onSelectPatient={() => {
                                                setSelectedPatient(patient);
                                                handleSelect();
                                            }}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                </div>
            </MainContainer>
        </div>
    );
}
