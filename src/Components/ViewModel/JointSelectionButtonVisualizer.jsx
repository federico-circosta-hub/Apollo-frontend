import { useState, useContext, useEffect } from "react";
import GenerateVisits from "../Model/GenerateVisits";
import format from "date-fns/format";
import editText from '../img/icon/edit-text.png'
import { NewVisitContext } from "../Model/NewVisitContext";

export default function JointSelectionButtonVisualizer(props) {

    const [edit, setEdit] = useState(false)

    const { newVisit } = useContext(NewVisitContext);

    const checkJoint = () => {
        let b = newVisit.jointPresence(props.name)
        setEdit(b)
    }

    useEffect(() => {
        checkJoint()
    }, [])

    return edit ? (
        <button onClick={() => props.click()} class="btn btn-success btn-lg">{props.name}<img src={editText} alt="edit" width={22} style={{ filter: `invert(100%)` }} /></button>
    )
        :
        (
            <button onClick={() => props.click()} class="btn btn-primary btn-lg">{props.name}</button>
        )
}