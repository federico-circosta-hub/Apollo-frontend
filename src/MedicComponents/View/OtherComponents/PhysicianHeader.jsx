import NavDropdown from "react-bootstrap/NavDropdown";
import format from "date-fns/format";
import { useContext, useState } from "react";
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

    const [showModal, setShowModal] = useState(false);

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

    const title = () => {
        <>
            {selectedPatient != null ? (
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
            ) : (
                ""
            )}
            {joint()}
        </>;
    };

    return (
        <>
            <Header
                {...props}
                showBack={selectedPatient != null}
                title={title}
                leftButton={
                    selectedPatient != null ? (
                        <button
                            class="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            {" "}
                            {"< Esci"}{" "}
                        </button>
                    ) : null
                }
                ExitModal={StopPatientProcessModal}
            />
            <StopPatientProcessModal show={{ showModal, setShowModal }} />
        </>
    );

    return (
        <>
            <nav class="navbar bg-body-tertiary">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        paddingLeft: "1%",
                        paddingRight: "1%",
                    }}
                >
                    <div>
                        {selectedPatient != null && (
                            <button
                                class="btn btn-primary"
                                onClick={() => setShowModal(true)}
                            >
                                {" "}
                                {"< Esci"}{" "}
                            </button>
                        )}
                    </div>
                    <div style={{ display: "flex" }}>
                        {selectedPatient != null ? (
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
                                    format(
                                        selectedPatient.birthdate,
                                        "(dd/MM/y)"
                                    )}
                            </label>
                        ) : (
                            ""
                        )}
                        {joint()}
                    </div>
                    <div style={{ display: "flex" }}>
                        <img
                            src={padlock}
                            width={22}
                            style={{ marginRight: 5 }}
                        />
                        <NavDropdown title={props.data}>
                            <button
                                onClick={props.logout}
                                style={{ margin: "auto" }}
                                class="btn btn-danger"
                            >
                                Logout
                            </button>
                        </NavDropdown>
                    </div>
                </div>
            </nav>
            <StopPatientProcessModal show={{ showModal, setShowModal }} />
        </>
    );
}
