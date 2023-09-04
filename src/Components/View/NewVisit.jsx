import { useContext, useEffect, useState } from "react"
import { NewVisitContext } from "../Model/NewVisitContext"
import { PatientContext } from "../Model/PatientContext"
import NewVisitModel from "../Model/NewVisitModel"
import HeaderPatient from "./HeaderPatient"
import NoContextModal from "./NoContextModal"
import { FormControl, Switch, InputLabel, Select, MenuItem } from "@mui/material"
import format from "date-fns/format"
import { Link } from "react-router-dom"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/it';
import FollowUpHelper from "../ViewModel/FollowUpHelper"
import { validateForm } from '../ViewModel/Validation'
import FormModal from './FormModal'
import { useNavigate } from 'react-router-dom';

export default function NewVisit(props) {

    const nav = useNavigate()

    const { newVisit, setNewVisit } = useContext(NewVisitContext)
    const { selectedPatient } = useContext(PatientContext)

    const activities = ['Cycling', 'Walk', 'Running', 'Swimming',]
    const traumaticEvents = ['None', 'Operation', 'Fall', 'Accident',]

    const [isFollowUp, setIsFollowUp] = useState(newVisit === null ? false : newVisit.followUp.followUp)
    const [disabledLeft, setDisabledLeft] = useState(newVisit === null ? true : !newVisit.physicalActivity.physicalActivity)
    const [physicalActivity, setPhysicalActivity] = useState(newVisit === null ? { 'physicalActivity': false, 'physicalActivityDate': '', 'physicalActivityType': '' } : newVisit.physicalActivity)
    const [traumaticEvent, setTraumaticEvent] = useState(newVisit === null ? { 'traumaticEvent': 'None', 'traumaticEventDate': '' } : newVisit.traumaticEvent)
    const [disabledRight, setDisabledRight] = useState(newVisit === null ? true : (newVisit.traumaticEvent.traumaticEvent === 'None') ? true : false)
    const [formModal, setFormModal] = useState(false)
    const [errors, setErrors] = useState({ none: 'none' })

    useEffect(() => {
        if (newVisit === null) {
            console.log('creo nuova visita')
            let nv = new NewVisitModel()
            nv.setPatient(selectedPatient.surname)
            setNewVisit(nv)
        }
    }, [])

    const handleChange = (e) => {
        physicalActivity.physicalActivity = e.target.checked
        setPhysicalActivity(physicalActivity)
        setDisabledLeft(!e.target.checked)
        if (!e.target.checked) { setPhysicalActivity({ 'physicalActivity': false, 'physicalActivityDate': '', 'physicalActivityType': '' }) }
    }

    const forward = () => {
        let o = {}
        o.traumaticEvent = traumaticEvent
        o.physicalActivity = physicalActivity
        let e = (validateForm('newVisit', o))
        console.log(Object.keys(e))
        if (Object.keys(e).length == 0) {
            newVisit.setIsFollowUp(isFollowUp)
            newVisit.setVisitDate(new Date())
            newVisit.setPhysicalActivity(physicalActivity)
            newVisit.setTraumaticEvent(traumaticEvent)
            setNewVisit(newVisit)
            setErrors({})
            console.log(newVisit)
            nav('/visit/newVisitInPresence/jointSelection');
        } else {
            setErrors(e)
            setFormModal(true)
        }
    }

    const modifyDate = (date, whatDate) => {
        if (whatDate == 'physicalActivityDate') {
            physicalActivity.physicalActivityDate = format(date, 'y-MM-dd')
            setPhysicalActivity(physicalActivity)
        } else {
            traumaticEvent.traumaticEventDate = format(date, 'y-MM-dd')
            setTraumaticEvent(traumaticEvent)
        }
    }

    const displayActivityItems = () => {
        return activities.map(element => <MenuItem value={element}>{element}</MenuItem>)
    }
    const displayTraumaticItems = () => {
        return traumaticEvents.map(element => <MenuItem value={element}>{element}</MenuItem>)
    }

    const handleActivity = (e) => {
        let newPhysicalActivity = { ...physicalActivity }
        newPhysicalActivity.physicalActivityType = e.target.value
        setPhysicalActivity(newPhysicalActivity)
    }

    const handleTrauma = (e) => {
        let newtraumaticEvent = { ...traumaticEvent }
        if (e.target.value === 'None') {
            setDisabledRight(true)
            newtraumaticEvent.traumaticEventDate = ''
        } else {
            setDisabledRight(false)
        }
        newtraumaticEvent.traumaticEvent = e.target.value
        setTraumaticEvent(newtraumaticEvent)
    }

    const followUp = (e) => {
        setIsFollowUp(e.target.checked)
    }

    const datePickerResolver = (b, s) => {
        if (b) {
            return <DatePicker disabled />
        } else {
            return <DatePicker onChange={(newValue) => modifyDate(newValue.$d, s)} label={s == 'traumaDate' ? traumaticEvent.traumaticEventDate : physicalActivity.physicalActivityDate} />
        }
    }

    const handleCancel = () => {
        setIsFollowUp(false)
    }

    return (selectedPatient !== null) ? (
        <div>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1%' }}>
                <HeaderPatient />
            </div>
            <div className="box-bianco" style={style.box}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '100%', alignItems: 'center' }}>
                        <label style={{ fontSize: 25 }}>Is this a follow up visit?</label>
                        <Switch defaultChecked={isFollowUp} onChange={followUp} />
                    </div>
                    <div >
                        {isFollowUp && <FollowUpHelper onCancel={handleCancel} />}
                    </div>
                </div>
                <div style={{ display: 'flex', width: '95%', alignItems: "center", justifyContent: 'space-between', }}>
                    <div style={style.buttons}>
                        <div style={{ display: 'flex' }}>
                            <label style={{ fontSize: 26 }} >Performed physical activity?</label>
                            <Switch defaultChecked={newVisit === null ? false : newVisit.physicalActivity.physicalActivity} onChange={handleChange} />

                        </div>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
                                {datePickerResolver(disabledLeft, 'physicalActivityDate')}
                            </LocalizationProvider >
                        </div>
                        <div >
                            <FormControl fullWidth disabled={disabledLeft} style={{ minWidth: 120, fontSize: 28 }}>
                                <InputLabel id="demo-simple-select-label">Physical activity</InputLabel>
                                <Select style={{ fontSize: 26 }}
                                    id="demo-simple-select"
                                    label="esercizio"
                                    value={physicalActivity.physicalActivityType}
                                    onChange={handleActivity}>
                                    {displayActivityItems()}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div style={style.verticalLine}>

                    </div>
                    <div style={style.buttons}>
                        <div >
                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label" style={{ width: 160 }}>Events</InputLabel>
                                <Select style={{ fontSize: 28 }}
                                    id="demo-simple-select"
                                    label="event"
                                    value={traumaticEvent.traumaticEvent}
                                    onChange={handleTrauma}>
                                    {displayTraumaticItems()}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it'>
                                {datePickerResolver(disabledRight, 'traumaDate')}
                            </LocalizationProvider >
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '95%' }}>
                    <div>
                        <Link onClick={() => setNewVisit(null)} to={'/visit/'} class="btn btn-danger btn-lg">Cancel</Link>
                    </div>
                    <div>
                        <button style={style.forwardButton} class="btn btn-success btn-lg" onClick={forward}>Forward</button>
                    </div>
                </div>
            </div>
            < div >
                {formModal && <FormModal formModal={formModal} setFormModal={setFormModal} errors={errors} />}
            </div >
        </div>
    )
        :
        (
            <NoContextModal what={" un paziente "} service={" nuova visita "} />
        )

}


const style = {
    buttons: {
        width: '47%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'right',
        justifyContent: 'space-around',
        marginBottom: '5%',
        border: '1px solid black',
        borderRadius: '20px',
        padding: '4%'
    },


    box: {
        justifyContent: 'space-around',
        gap: 20,
        width: '98%',
        height: '80vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1%',
        paddingTop: '2%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    verticalLine: {
        width: 1,
        backgroundColor: 'grey',
        height: '60%',
        borderRadius: 15,
        margin: 0,
        marginBottom: '7%',
    }
}


