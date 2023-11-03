import { format } from "date-fns";
import editUser from "./../../img/icon/edit-user.png";
import { useState } from "react";
import ModifyPatientModal from "../Modals/ModifyPatientModal";
import nameChecker from "../../ViewModel/NameChecker";

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
        {nameChecker(props.patient.surname)}
      </td>
      <td
        onClick={() => {
          select();
        }}
      >
        {nameChecker(props.patient.name)}
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
      <td
        onClick={() => {
          select();
        }}
      >
        {props.patient.cf}
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
