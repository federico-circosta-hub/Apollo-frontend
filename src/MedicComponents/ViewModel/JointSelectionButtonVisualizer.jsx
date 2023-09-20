import { useState, useContext, useEffect } from "react";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import editText from '../img/icon/edit-text.png'
import { NewVisitContext } from "../Model/NewVisitContext";
import DeleteJointModal from "../View/Modals/DeleteJointModal";

export default function JointSelectionButtonVisualizer(props) {

    const [edit, setEdit] = useState(false)
    const [jointToDelete, setJointToDelete] = useState(null)

    const { newVisit } = useContext(NewVisitContext);

    const checkJoint = () => {
        let b = newVisit.jointPresence(props.name)
        setEdit(b)
    }

    useEffect(() => {
        checkJoint()
    }, [newVisit])

    return edit ? (
        <div>
            <button onClick={() => props.click()} class="btn btn-success btn-lg">{props.name}<img src={editText} alt="edit" width={22} style={{ filter: `invert(100%)` }} /></button>
            <button onClick={() => { setJointToDelete(props.name); }} class="btn btn-danger" ><DeleteForeverOutlinedIcon /></button>
            {jointToDelete != null && <DeleteJointModal joint={{ jointToDelete, setJointToDelete }} deleteJoint={() => { props.deleteJoint(jointToDelete); setEdit(false); setJointToDelete() }} />}
        </div>
    )
        :
        (
            <button onClick={() => props.click()} class="btn btn-primary btn-lg">{props.name}</button>
        )
}