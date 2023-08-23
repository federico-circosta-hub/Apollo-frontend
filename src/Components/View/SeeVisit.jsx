import { useContext } from "react"
import { VisitContext } from "../Model/VisitContext"
import { format, } from 'date-fns';
import itLocale from 'date-fns/locale/it';
import NoContextModal from "./NoContextModal";

export default function SeeVisit() {

    const { selectedVisit } = useContext(VisitContext)

    return selectedVisit !== null ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1%' }}>
            <div>
                <h1>Visita: {format(selectedVisit, 'EEEEEE, d MMMM y', { locale: itLocale })}</h1>
            </div>

            <div>
                <h3>Coming soon</h3>
            </div>

        </div>

    )
        :
        (
            <NoContextModal what={" paziente e relativa visita "} service={" visualizzazione visita passata"} />
        )
}

