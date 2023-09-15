import { format, } from 'date-fns';
import itLocale from 'date-fns/locale/it';

export default function VisitLine(props) {

    const select = () => {
        props.onSelectVisit()
    }

    return (
        <div style={{ border: '0.5px solid lightgray', padding: 30, background: props.isSelected ? 'lightgreen' : 'white' }} onClick={() => select()} >
            <h5>
                {format(props.visit, 'EEEEEE, d MMMM y', { locale: itLocale })}
            </h5>
        </div>
    )
}