import { format, } from 'date-fns';

export default function PatientLine(props) {

    const select = () => {
        props.onSelectPatient()
    }

    return (
        <div style={{ border: '0.5px solid lightgray', padding: 30, background: props.isSelected ? 'lightgreen' : 'white' }} onClick={() => select()} >

            <h5>
                {props.patient.surname} {props.patient.name}, {format(props.patient.birthdate, 'y-MM-dd')}
            </h5>

        </div>
    )
}