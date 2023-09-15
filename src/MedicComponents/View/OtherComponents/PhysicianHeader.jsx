import NavDropdown from "react-bootstrap/NavDropdown";
import format from "date-fns/format";
import { useContext, useEffect, useState } from "react";
import padlock from "../../img/icon/padlock.png";
import heartbeat from "../../img/icon/heartbeat.png";
import joints from "../../img/icon/joints.png";
import { PatientContext } from "../../Model/PatientContext";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import StopPatientProcessModal from "../Modals/StopPatientProcessModal";
import Header from "../../../CommonComponents/Header";

export default function PhysicianHeader(props) {
    const { selectedPatient } = useContext(PatientContext);
    const { currentJoint } = useContext(CurrentJointContext);

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
            return (
                selectedPatient != null && (
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
                )
            );
        });
    }, [selectedPatient, currentJoint]);

    return (
        <>
            <Header
                {...props}
                title={title}
                leftButton={
                    selectedPatient != null ? (
                        <button
                            class="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            {" "}
                            {"< Exit"}{" "}
                        </button>
                    ) : null
                }
                ExitModal={StopPatientProcessModal}
            />
            <StopPatientProcessModal show={{ showModal, setShowModal }} />
        </>
    );

}
