import { format, } from 'date-fns';
import itLocale from 'date-fns/locale/it';

export default function VisitLine(props) {

    const select = () => {
        props.onSelectVisit()
    }

    return (
        <tr className='tr-lg' style={{/*  borderBottom: '0.5px solid lightgray', */ padding: 30, }} onClick={() => select()}>
            <td>
                {props.visit.id}
            </td>
            <td>
                <tr style={{ display: 'flex', }}>
                    {/* <td style={{ flex: 0.5 }}>
                        {format(props.visit, 'EEEEEE', { locale: itLocale })}
                    </td> */}
                    <td style={{ flex: 0.3, alignItems: 'right', textAlign: 'left' }}>
                        {format(props.visit.date, 'dd', { locale: itLocale })}
                    </td>
                    <td style={{ flex: 0.6, alignItems: 'right', textAlign: 'left' }}>
                        {format(props.visit.date, 'MMMM', { locale: itLocale })}
                    </td>
                    <td style={{ flex: 1, alignItems: 'right', textAlign: 'left' }}>
                        {format(props.visit.date, 'y', { locale: itLocale })}
                    </td>
                </tr>
            </td>
            <td>
                {props.visit.physician}
            </td>
            <td>
                {props.visit.type}
            </td>
        </tr>
    )
}