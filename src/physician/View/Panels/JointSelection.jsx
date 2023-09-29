import { useState, useContext, useEffect } from "react";
import male from "../../img/male.png";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { NewVisitContext } from "../../Model/NewVisitContext";
import EndingJointModal from "../Modals/EndingJointModal";
import JointSelectionButtonVisualizer from "../../ViewModel/JointSelectionButtonVisualizer";
import { CurrentJointContext } from "../../Model/CurrentJointContext";
import CircularProgress from "@mui/material/CircularProgress";
import MainContainer from "../../../common/View/MainContainer";

export default function JointSelection() {
    const { newVisit, setNewVisit } = useContext(NewVisitContext);
    const { setCurrentJoint } = useContext(CurrentJointContext);

    const [showEndingModal, setShowEndingModal] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const navigate = useNavigate();

    const handleJoint = (s) => {
        newVisit.setCurrentJoint(s);
        setNewVisit(newVisit);
        setCurrentJoint(s);
        navigate("/newVisit/jointSelection/joint");
    };

    const deleteJoint = (s) => {
        newVisit.deleteJoint(s);
        setNewVisit(newVisit);
    };

    return (
        <div>
            <MainContainer>

                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "left",

                    }}
                >
                    <div>
                        <h3>Seleziona l'articolazione da visitare: </h3>
                    </div>
                </div>

                <div
                    className="fascia centrale"
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        textAlign: "center",

                    }}
                >
                    <div style={style.protLeft}>
                        <div>
                            <JointSelectionButtonVisualizer
                                click={() => {
                                    handleJoint("Gomito dx");
                                }}
                                deleteJoint={(s) => deleteJoint(s)}
                                name={"Gomito dx"}
                            />
                        </div>
                        <div>
                            <JointSelectionButtonVisualizer
                                click={() => handleJoint("Right knee")}
                                deleteJoint={(s) => deleteJoint(s)}
                                name={"Ginocchio dx"}
                            />
                        </div>
                        <div>
                            <JointSelectionButtonVisualizer
                                click={() => handleJoint("Caviglia dx")}
                                deleteJoint={(s) => deleteJoint(s)}
                                name={"Caviglia dx"}
                            />
                        </div>
                    </div>

                    <div style={{ width: "30%" }}>
                        {!imgLoaded && <CircularProgress />}
                        <img
                            onLoad={() => setImgLoaded(true)}
                            src={male}
                            alt="male human silhouette"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "60vh",
                                position: "relative",
                                margin: "auto",
                                display: imgLoaded ? "block" : "none",
                            }}
                        />
                    </div>
                    <div style={style.prot}>
                        <div>
                            <JointSelectionButtonVisualizer
                                click={() => handleJoint("Gomito sx")}
                                deleteJoint={(s) => deleteJoint(s)}
                                name={"Gomito sx"}
                            />
                        </div>
                        <div>
                            <JointSelectionButtonVisualizer
                                click={() => handleJoint("Ginocchio sx")}
                                deleteJoint={(s) => deleteJoint(s)}
                                name={"Ginocchio sx"}
                            />
                        </div>
                        <div>
                            <JointSelectionButtonVisualizer
                                click={() => handleJoint("Caviglia sx")}
                                deleteJoint={(s) => deleteJoint(s)}
                                name={"Caviglia sx"}
                            />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        height: "15vh",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        width: "95%",
                    }}
                >
                    <div>
                        <Link
                            className="btn btn-danger"
                            to={"/newVisit/"}
                        >
                            Indietro
                        </Link>
                    </div>
                    <div>
                        <button
                            className="btn btn-warning"
                            onClick={() => setShowEndingModal(true)}
                        >
                            Concludi visita
                        </button>
                    </div>
                </div>

            </MainContainer>
            <EndingJointModal
                objectData={newVisit}
                show={{ showEndingModal, setShowEndingModal }}
            />
        </div>
    );
}

const style = {
    prot: {
        width: "30%",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "space-between",
        marginTop: "12%",
    },
    protLeft: {
        width: "30%",
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        justifyContent: "space-between",
        marginTop: "12%",
    },
    box: {
        justifyContent: "space-between",
        width: "95%",
        height: "90vh",
        borderRadius: "15px",
        background: "white",
        margin: "auto",
        marginTop: "1%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    forwardButton: {
        justifyContent: "right",
        display: "flex",
        marginRight: "1%",
        marginBottom: "1%",
        marginLeft: "auto",
        alignItems: "right",
    },
};
