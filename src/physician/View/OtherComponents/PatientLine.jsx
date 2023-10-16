import { format } from "date-fns";
import editUser from "./../../img/icon/edit-user.png";

export default function PatientLine(props) {
  const select = () => {
    props.onSelectPatient();
  };

  return (
    <tr
      className="tr-lg"
      style={{
        padding: 30,
        background: props.isSelected ? "lightgreen" : "white",
      }}
      onClick={() => select()}
    >
      <td>{props.patient.cf}</td>
      <td>{props.patient.surname}</td>
      <td>{props.patient.name}</td>
      <td>
        {props.patient.birthdate !== ""
          ? format(new Date(props.patient.birthdate), "y-MM-dd")
          : ""}
      </td>
      <td>
        <button
          className="btn btn-info"
          onClick={(event) => {
            event.stopPropagation();
            console.log("modifica", props.patient);
          }}
        >
          <img src={editUser} alt="edit user button" width={30} height={30} />
        </button>
      </td>
    </tr>
  );
}
