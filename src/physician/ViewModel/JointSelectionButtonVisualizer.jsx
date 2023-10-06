import { useState, useContext, useEffect } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import editText from "../img/icon/edit-text.png";
import { NewVisitContext } from "../Model/NewVisitContext";
import DeleteJointModal from "../View/Modals/DeleteJointModal";
import { Button } from "@mui/material";

export default function JointSelectionButtonVisualizer(props) {
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);

  const { newVisit } = useContext(NewVisitContext);

  const checkJoint = () => {
    let b = newVisit.jointPresence(props.nameAndSide);
    setEdit(b);
  };

  useEffect(() => {
    checkJoint();
  }, []);

  return edit ? (
    <div>
      <button onClick={() => props.click()} className="btn btn-success btn-lg">
        {props.name}
        <img
          src={editText}
          alt="edit"
          width={22}
          style={{ filter: `invert(100%)` }}
        />
      </button>
      <Button
        variant="outlined"
        color="warning"
        onClick={() => {
          setDel(true);
        }}
        style={{ margin: "10px" }}
      >
        <DeleteForeverOutlinedIcon />
      </Button>

      {del && (
        <DeleteJointModal
          cancel={() => setDel(false)}
          joint={props.name}
          deleteJoint={() => {
            props.deleteJoint();
            setEdit(false);
            setDel(false);
          }}
        />
      )}
    </div>
  ) : (
    <button onClick={() => props.click()} className="btn btn-primary btn-lg">
      {props.name}
    </button>
  );
}
