import { format } from "date-fns";

export default function PatientLine(props) {
  const select = () => {
    props.onSelectPatient();
  };

  return (
    <tr
      className="tr-lg"
      style={{
        /*  borderBottom: '0.5px solid lightgray', */ padding: 30,
        background: props.isSelected ? "lightgreen" : "white",
      }}
      onClick={() => select()}
    >
      {/* <td>{props.patient.pid}</td> */}
      <td>{props.patient.surname}</td>
      <td>{props.patient.name}</td>
      <td>{format(props.patient.birthdate, "y-MM-dd")}</td>
    </tr>
  );
}
