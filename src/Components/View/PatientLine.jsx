import { format, } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PatientLine(props) {

    const select = () => {
        props.onSelectPatient()
    }

    return (
        <div style={{ padding: 30, background: props.isSelected ? 'lightgreen' : 'white' }} onClick={() => select()} >
            <Link className="btn btn-success btn-lg" to={'/visit'}>
                <h5>
                    {props.patient.surname}, {props.patient.name}, {format(props.patient.birthdate, 'y-MM-dd')}
                </h5>
            </Link>

        </div>
    )
}