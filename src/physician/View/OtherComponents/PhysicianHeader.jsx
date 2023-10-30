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
import JointNameChanger from "./../../ViewModel/JointNameChanger";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { useNavigate } from "react-router-dom";
import exit from "./../../img/icon/logout.png";

export default function PhysicianHeader(props) {
  const { selectedPatient } = useContext(PatientContext);
  const { currentJoint } = useContext(CurrentJointContext);
  const { newVisit } = useContext(NewVisitContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(null);
  const [leftButton, setLeftButton] = useState(null);
  const [homeRoute, setHomeRoute] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const joint = () => {
      return currentJoint != null && currentJoint !== "" ? (
        <label>
          <img src={joints} width={40} height={40} style={{ marginRight: 5 }} />
          {JointNameChanger.fromSeparateEnglishToSingleStringIta(
            currentJoint.name,
            currentJoint.side
          )}
        </label>
      ) : (
        ""
      );
    };
    const otherButton = () => {
      return location.pathname === "/searchVisit" ? (
        <button
          className="btn btn-primary"
          onClick={() => navigate("/", { replace: true })}
        >
          Home
        </button>
      ) : location.pathname == "/newVisit" ||
        location.pathname == "/newVisit/" ||
        location.pathname === "/newVisit/jointSelection" ||
        location.pathname === "/newVisit/jointSelection/joint" ||
        location.pathname === "/newVisit/drug" ? (
        <button
          className="btn btn-danger"
          onClick={() => {
            setHomeRoute(false);
            setShowModal(true);
          }}
        >
          <img
            src={exit}
            alt="uscita"
            width={25}
            style={{ filter: "invert(100%)" }}
          />
        </button>
      ) : (
        ""
      );
    };
    setLeftButton(() => {
      return (
        <div style={{ display: "flex", justifyContent: "left", width: "8%" }}>
          <PositionedMenu
            setShowModal={setShowModal}
            setHomeRoute={setHomeRoute}
          />
          {otherButton()}
        </div>
      );
    });
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
                format(new Date(selectedPatient.birthdate), "(dd/MM/y)")}
            </label>
            {newVisit && (
              <label>
                {" "}
                {"— [visita "}
                {format(newVisit.visitDate, "y-MM-dd")}
                {"]"}{" "}
              </label>
            )}
            {joint()}
          </>
        );
      } else {
        return (
          <label style={{ fontSize: 20, fontWeight: "500" }}>
            Home — elenco pazienti
          </label>
        );
      }
    });
  }, [selectedPatient, currentJoint, location.pathname]);

  return (
    <>
      <Header
        {...props}
        title={title}
        leftButton={leftButton}
        ExitModal={StopPatientProcessModal}
      />
      <StopPatientProcessModal
        show={{ showModal, setShowModal }}
        home={homeRoute}
      />
    </>
  );
}
