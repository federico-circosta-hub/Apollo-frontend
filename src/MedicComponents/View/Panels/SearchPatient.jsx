import { Link, useNavigate } from 'react-router-dom';
import search from '../../img/icon/search.png'
import add from '../../img/icon/add-user.png'
import note from '../../img/icon/note.png'
import React, { useContext, useEffect, useState } from 'react';
import { PatientContext } from '../../Model/PatientContext';
import PatientLine from '../OtherComponents/PatientLine';
import GeneratePatients from '../../Model/GeneratePatients'

export default function SearchPatient() {

    const [patientList, setPatientList] = useState([])
    const [patientListToShow, setPatientListToShow] = useState([])

    const navigate = useNavigate()

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
        setTimeout(() => {
            navigate('/searchVisit')
        }, 200)
    }

    const research = (event) => {
        setPatientListToShow([])
        let arr = patientList.filter((patient) =>
            patient.surname.toLowerCase().includes(event.target.value.toLowerCase()) || patient.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setPatientListToShow(arr)
        if (event.target.value === '') setPatientListToShow(patientList)

    }


    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>

            <div style={style.box}>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <img src={search} width={30} height={30} /><input style={{ width: '45%', fontSize: 24 }} type="text" name="name" placeholder='cerca per nome o cognome...' onChange={(event) => research(event)} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: '2%' }}>

                        <div >
                            <Link to={'/newPatient'} className="btn btn-primary btn-lg" >
                                Nuovo paziente  <img src={add} alt="search" width={40} style={{ filter: `invert(100%)` }} />
                            </Link>
                        </div>




                    </div>
                </div>


                <div style={{ width: '100%', height: '72vh', overflow: 'auto', textAlign: 'left', borderRadius: '15px', border: '0.5px solid black' }}>
                    {patientListToShow.map((patient, index) => (
                        <PatientLine key={index} patient={patient} isSelected={patient === selectedPatient} onSelectPatient={() => { setSelectedPatient(patient); handleSelect() }} />
                    ))}

                </div>
            </div>

        </div>
    )
}

const style = {
    box: {
        width: '95%',
        height: '92vh',
        gap: '5%',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1%',
        display: 'flex',
        flexDirection: 'column',
        alignText: 'left',
        alignItems: 'left',
        padding: '2%',
        overflow: 'auto',
        justifyContent: 'start',

    }
}


