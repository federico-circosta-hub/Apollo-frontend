import format from "date-fns/format";
import { useContext, useEffect, useState } from "react";
import heartbeat from "../../img/icon/heartbeat.png";
import joints from "../../img/icon/joints.png";
import { PatientContext } from "../../Model/PatientContext";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import StopPatientProcessModal from "../Modals/StopPatientProcessModal";
import Header from "../../../common/View/Header";
import PositionedMenu from "./PositionedMenu";
import { useLocation } from "react-router-dom";

export default function PhysicianHeader(props) {
  const { selectedPatient } = useContext(PatientContext);
  const { currentJoint } = useContext(CurrentJointContext);
  const location = useLocation();

  const [title, setTitle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const joint = () => {
      return currentJoint != null && currentJoint !== "" ? (
        <label>
          <img src={joints} width={40} style={{ marginRight: 5 }} />
          {currentJoint}
        </label>
      ) : (
        ""
      );
    };

    setTitle(() => {
      if (location.pathname === "/annotations") {
        return (
          <label style={{ fontSize: 20, fontWeight: "500" }}>
            Task di annotazione
          </label>
        );
      } else if (selectedPatient != null) {
        return (
          <>
            <label style={{ fontSize: 20, fontWeight: "500" }}>
              <img src={heartbeat} width={40} style={{ marginRight: 5 }} />
              {selectedPatient.name +
                " " +
                selectedPatient.surname +
                " " +
                format(selectedPatient.birthdate, "(dd/MM/y)")}
            </label>
            {joint()}
          </>
        );
      } else {
        return (
          <label style={{ fontSize: 20, fontWeight: "500" }}>
            Elenco pazienti
          </label>
        );
      }
    });
  }, [selectedPatient, currentJoint, location]);

  return (
    <>
      <Header
        {...props}
        title={title}
        leftButton={<PositionedMenu setShowModal={setShowModal} />}
        ExitModal={StopPatientProcessModal}
      />
      <StopPatientProcessModal show={{ showModal, setShowModal }} />
    </>
  );
}
