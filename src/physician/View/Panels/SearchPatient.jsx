import { Link, useNavigate } from "react-router-dom";
import search from "../../img/icon/search.png";
import add from "../../img/icon/add-user.png";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, useEffect, useState } from "react";
import { PatientContext } from "../../Model/PatientContext";
import PatientLine from "../OtherComponents/PatientLine";
import GeneratePatients from "../../Model/GeneratePatients";
import Communication from '../../../common/Model/Communication'
import Table from '@mui/joy/Table';
import FakeSecurityModule from './../../Model/FakeSecurityModule'
import MainContainer from "../../../common/View/MainContainer";

export default function SearchPatient() {

    const [patientList, setPatientList] = useState(null);
    const [patientListToShow, setPatientListToShow] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false)

    const navigate = useNavigate();

    const { selectedPatient, setSelectedPatient } = useContext(PatientContext);

    useEffect(() => {
        setLoadingPatients(true)
        setTimeout(() => {
            getPatients();
        }, 2500)

    }, []);

    const getPatients = async () => {
        /* let arr = GeneratePatients(); */
        const idArray = await Communication.get('patient', '')
        console.log(idArray)
        const patientArray = await FakeSecurityModule.decriptPatients(idArray)
        patientArray.sort((a, b) => a.surname.localeCompare(b.surname));
        setPatientList(patientArray);
        setPatientListToShow(patientArray);
        setLoadingPatients(false)
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
                <div style={{ width: '100%', display: "flex", justifyContent: "left", alignItems: "center" }}>
                    <img src={search} width={30} height={30} />
                    <input
                        style={{ width: "45%", fontSize: 24 }}
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
                            paddingLeft: "2%",
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
                        textAlign: loadingPatients ? 'center' : "left",
                        borderRadius: "15px",
                        border: "0.5px solid #56AEC9",
                        boxShadow: "1px 2px 6px #56AEC9",
                    }}
                >
                    {loadingPatients ? <CircularProgress /> : (
                        <table className='table table-primary table-striped table-hover'>
                            <thead style={{ position: "sticky", top: 0, height: '6vh', }}>
                                <tr  >
                                    <th style={{ background: 'white' }}>id</th>
                                    <th style={{ background: 'white' }}>Cognome</th>
                                    <th style={{ background: 'white' }}>Nome</th>
                                    <th style={{ background: 'white' }}>Data di nascita</th>

                                </tr>

                            </thead>

                            <tbody >

                                {patientListToShow.map((patient, index) => (
                                    <PatientLine
                                        key={index}
                                        patient={patient}
                                        isSelected={patient === selectedPatient}
                                        onSelectPatient={() => {
                                            setSelectedPatient(patient);
                                            handleSelect();
                                        }}
                                    />
                                ))}

                            </tbody>
                        </table>
                    )
                    }
                </div>
            </MainContainer>
        </div>
    );
}

const style = {
    box: {
        width: "95%",
        height: "90vh",
        gap: "4%",
        borderRadius: "15px",
        background: "white",
        margin: "auto",
        marginTop: "1%",
        display: "flex",
        flexDirection: "column",
        alignText: "left",
        alignItems: "left",
        padding: "2%",
        overflow: "auto",
        justifyContent: "start",
        boxShadow: "1px 2px 6px #4169e1",
    },
};
