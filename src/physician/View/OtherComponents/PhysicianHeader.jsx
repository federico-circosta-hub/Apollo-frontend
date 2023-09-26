import NavDropdown from "react-bootstrap/NavDropdown";
import format from "date-fns/format";
import { useContext, useEffect, useState } from "react";
import padlock from "../../img/icon/padlock.png";
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
            return currentJoint != null && currentJoint != "" ? (
                <label>
                    <img src={joints} width={25} style={{ marginRight: 5 }} />
                    {currentJoint}
                </label>
            ) : (
                ""
            );
        };

        setTitle(() => {
            if (location.pathname === "/annotations") {
                return "Task di annotazione";
            } else if (selectedPatient != null) {
                return (
                    <>
                        <label>
                            <img
                                src={heartbeat}
                                width={30}
                                style={{ marginRight: 5 }}
                            />
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
                return "Elenco pazienti";
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
