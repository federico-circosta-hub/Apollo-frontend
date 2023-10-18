import { format } from "date-fns";
import editUser from "./../../img/icon/edit-user.png";
import { useState } from "react";
import ModifyPatientModal from "../Modals/ModifyPatientModal";

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
    >
      <td
        onClick={() => {
          select();
        }}
      >
        {props.patient.cf}
      </td>
      <td
        onClick={() => {
          select();
        }}
      >
        {props.patient.surname}
      </td>
      <td
        onClick={() => {
          select();
        }}
      >
        {props.patient.name}
      </td>
      <td
        onClick={() => {
          select();
        }}
      >
        {props.patient.birthdate ? (
          format(new Date(props.patient.birthdate), "y-MM-dd")
        ) : (
          <em>N/A</em>
        )}
      </td>

      <td>
        <button
          className="btn btn-info"
          onClick={() => {
            props.onMod(props.patient);
          }}
        >
          <img src={editUser} alt="edit user button" width={30} height={30} />
        </button>
      </td>
    </tr>
  );
}
