import { Link } from 'react-router-dom';
import back from '../img/stetoscopio.jpeg';
import search from '../img/icon/search.png'
import add from '../img/icon/add-user.png'
import React, { useContext, useEffect, useState } from 'react';
import { PatientContext } from '../Model/PatientContext';
import PatientLine from './PatientLine';
import GeneratePatients from '../Model/GeneratePatients'

export default function SearchPatient() {

    const [patientList, setPatientList] = useState([])
    const [patientListToShow, setPatientListToShow] = useState([])
    const [forward, setForward] = useState('none');
    const [disabledForward, setDisabledForward] = useState('flex');
    const { selectedPatient, setSelectedPatient } = useContext(PatientContext);

    useEffect(() => {
        getPatients()
    }, [])

    const getPatients = () => {
        console.log('chiamo getPatients')
        let arr = GeneratePatients()
        arr.sort((a, b) => a.surname.localeCompare(b.surname))
        setPatientList(arr)
        setPatientListToShow(arr)
    }

    const handleSelect = () => {
        setForward('flex')
        setDisabledForward('none')
    }

    const research = (event) => {
        setPatientListToShow([])
        let arr = patientList.filter((patient) =>
            patient.surname.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setPatientListToShow(arr)
        if (event.target.value === '') setPatientListToShow(patientList)

    }


    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={style.box}>
                <Link to={'/searchPatient'} className="btn btn-secondary btn-lg" disabled>
                    <label >Ricerca paziente <img src={search} alt="search" width={40} style={{ filter: `invert(100%)` }} /></label>
                </Link>

                <Link to={'/newPatient'} className="btn btn-primary btn-lg" >
                    <label >Nuovo paziente  <img src={add} alt="search" width={40} style={{ filter: `invert(100%)` }} /></label>
                </Link>
            </div>

            <div style={style.box}>
                <input type="text" name="name" placeholder='cerca per cognome...' onChange={(event) => research(event)} />
                <div style={{ height: '65vh', overflow: 'auto', width: '90%', textAlign: 'center' }}>

                    <h2 style={{ position: 'sticky', top: 0, bottom: 10, background: 'white' }}>Elenco pazienti:</h2>
                    <div style={{ height: '45vh' }}>
                        {patientListToShow.map((patient, index) => (
                            <PatientLine key={index} patient={patient} isSelected={patient === selectedPatient} onSelectPatient={() => { setSelectedPatient(patient); handleSelect() }} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

const style = {
    box: {
        width: '45%',
        height: '80vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '5%',
        display: 'flex',
        flexDirection: 'column',
        alignText: 'center',
        alignItems: 'center',
        paddingBottom: '2%',
        paddingTop: '0.2%',
        overflow: 'auto',
        justifyContent: 'space-around',

    }
}


