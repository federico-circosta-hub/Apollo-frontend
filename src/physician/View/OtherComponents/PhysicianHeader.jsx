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
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import nameChecker from "../../ViewModel/NameChecker";
import { useRef } from "react";
import { VisitContext } from "../../Model/VisitContext";

export default function PhysicianHeader(props) {
  const { selectedPatient, setSelectedPatient } = useContext(PatientContext);
  const { currentJoint } = useContext(CurrentJointContext);
  const { newVisit } = useContext(NewVisitContext);
  const { selectedVisit } = useContext(VisitContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(null);
  const [leftButton, setLeftButton] = useState(null);
  const [homeRoute, setHomeRoute] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const joint = () => {
      return currentJoint != null && currentJoint !== "" ? (
        <>
          <label style={{ marginRight: 10 }}>
            <img
              src={joints}
              width={40}
              height={40}
              style={{ marginRight: 5 }}
            />
            {JointNameChanger.fromSeparateEnglishToSingleStringIta(
              currentJoint.name,
              currentJoint.side
            )}
          </label>
          <button
            className="btn btn-success"
            onClick={() => props.activateButton(2)}
          >
            Salva
          </button>
        </>
      ) : (
        ""
      );
    };
    const otherButton = () => {
      return location.pathname === "/searchVisit" ? (
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedPatient(null);
            navigate("/", { replace: true });
          }}
        >
          <HomeOutlinedIcon />
        </button>
      ) : location.pathname == "/newVisit" ||
        location.pathname == "/newVisit/" ||
        location.pathname === "/newVisit/jointSelection" ||
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
      ) : location.pathname === "/newVisit/jointSelection/joint" ? (
        <div style={{ display: "flex" }}>
          <button
            className="btn btn-danger"
            onClick={() => props.activateButton(1)}
          >
            Annulla
          </button>
        </div>
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
          <div style={{ diplay: "flex" }}>
            <label style={{ fontSize: 20, fontWeight: "500" }}>
              <img src={heartbeat} width={40} style={{ marginRight: 5 }} />
              {nameChecker(selectedPatient.name) +
                " " +
                nameChecker(selectedPatient.surname) +
                " " +
                format(new Date(selectedPatient.birthdate), "(dd/MM/y)")}
            </label>
            {newVisit && (
              <label>
                {" "}
                {"— [visita "}
                {format(newVisit.visitDate, "dd-MM-y")}
                {"]"}{" "}
              </label>
            )}
            {selectedVisit && location.pathname === "/seeVisit" && (
              <label>
                {" "}
                {"— [visita "}
                {format(new Date(selectedVisit.date), "dd-MM-y")}
                {"]"}{" "}
              </label>
            )}
            {joint()}
          </div>
        );
      } else {
        return (
          <label style={{ fontSize: 20, fontWeight: "500" }}>
            Elenco pazienti
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
