import { useContext, useState, useEffect } from "react";
import { VisitContext } from "../../Model/VisitContext";
import { format } from "date-fns";
import it from "date-fns/locale/it";
import NoContextModal from "../Modals/NoContextModal";
import VisitObjectGenerator from "../../Model/VisitObjectGenerator";
import { useNavigate } from "react-router-dom";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import MainContainer from "../../../common/View/MainContainer";
import VisitInfo from "../OtherComponents/SeeVisit/VisitInfo";
import JointInfo from "../OtherComponents/SeeVisit/JointInfo";
import JointNameChanger from "../../ViewModel/JointNameChanger";
import { CircularProgress } from "@mui/material";
import { RefreshButton } from "../OtherComponents/RefreshButton";

export default function SeeVisit() {
    const { selectedVisit } = useContext(VisitContext);
    const [visit, setVisit] = useState(null);
    const [loadingVisit, setLoadingVisit] = useState(false);
    const [networkError, setNetworkError] = useState(null);
    const [selectedJointForInfo, setSelectedJointForInfo] = useState(null);
    const [selectedJoint, setSelectedJoint] = useState(null);

    useEffect(() => {
        loadVisit();
    }, []);

    const loadVisit = async () => {
        setNetworkError(null);
        setLoadingVisit(true);
        try {
            const visitObject = await CommunicationController.get(
                "visit/details",
                {
                    id: selectedVisit.id,
                }
            );
            console.log(visitObject);
            setVisit(visitObject);
        } catch (err) {
            setNetworkError(err || "Errore inatteso");
        } finally {
            setLoadingVisit(false);
        }
    };

    const handleJointSelection = (j) => {
        setSelectedJoint(null);
        console.log(j);
        setSelectedJoint(j);
    };

    const navigate = useNavigate();

    return selectedVisit !== null ? (
        <MainContainer
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 0,
            }}
        >
            {loadingVisit && visit === null && <h3>Loading...</h3>}
            {networkError !== null && (
                <div style={{ marginTop: "5%" }}>
                    Errore nell'ottenere la visita
                    <RefreshButton
                        onClick={() => {
                            loadVisit();
                            console.log(networkError);
                        }}
                    />
                </div>
            )}
            {!loadingVisit && visit !== null && networkError === null && (
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            background:
                                selectedJoint !== null ? "#87cefa" : "#4682b4",
                            width: "100%",
                            height: "6vh",
                            alignItems: "center",
                            borderStartEndRadius: "15px",
                            borderStartStartRadius: "15px",
                        }}
                    >
                        <h2 style={{ color: "white" }}>
                            {selectedJoint !== null
                                ? "Dettagli articolazione"
                                : "Dettagli visita"}
                        </h2>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                overflow: "scroll",
                                display: "flex",
                                flexDirection: "column",
                                width: "25%",
                                border:
                                    selectedJoint !== null
                                        ? "0.5px solid #87cefa"
                                        : "0.5px solid #4682b4",
                                boxShadow:
                                    selectedJoint !== null
                                        ? "2px 2px 4px #87cefa"
                                        : "2px 2px 4px #4682b4",
                                borderRadius: 15,
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    padding: "2vh",
                                    background:
                                        selectedJoint === null
                                            ? "#4682b4"
                                            : "white",
                                    borderRadius: 15,
                                }}
                            >
                                <button
                                    onClick={() => setSelectedJoint(null)}
                                    className={
                                        selectedJoint != null
                                            ? "btn btn-lg btn-primary"
                                            : "btn btn-lg btn-light"
                                    }
                                >
                                    Dettagli visita
                                </button>
                            </div>
                            {visit !== null &&
                                visit.report.joints.length > 0 &&
                                visit.report.joints.map((item, index) => (
                                    <div
                                        style={{
                                            width: "100%",
                                            textAlign: "center",
                                            padding: "2vh",
                                            background:
                                                selectedJoint == item
                                                    ? "#87cefa"
                                                    : "white",
                                            borderRadius: 15,
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                handleJointSelection(item)
                                            }
                                            className={
                                                selectedJoint != item
                                                    ? "btn btn-lg btn-primary"
                                                    : "btn btn-lg btn-light"
                                            }
                                            key={index}
                                        >
                                            {JointNameChanger.fromSeparateEnglishToSingleStringIta(
                                                item.name,
                                                item.side
                                            )}
                                        </button>
                                    </div>
                                ))}
                        </div>

                        <div
                            style={{
                                overflow: "auto",
                                width: "70%",
                                textAlign: "center",
                                height: "68vh",
                                border:
                                    selectedJoint !== null
                                        ? "0.5px solid #87cefa"
                                        : "0.5px solid #4682b4",
                                boxShadow:
                                    selectedJoint !== null
                                        ? "2px 2px 4px #87cefa"
                                        : "2px 2px 4px #4682b4",
                                padding: "1.5%",
                                borderRadius: 15,
                            }}
                        >
                            <div>
                                {selectedJoint !== null && (
                                    <JointInfo
                                        visit={visit}
                                        selectedJoint={selectedJoint}
                                    />
                                )}

                                {visit !== null && selectedJoint === null && (
                                    <VisitInfo visit={visit} />
                                )}
                                {visit === null && selectedJoint === null && (
                                    <CircularProgress />
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ marginBottom: "1%" }}>
                        <button
                            style={{ fontSize: 24 }}
                            className="btn btn-danger btn"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Chiudi
                        </button>
                    </div>
                </>
            )}
        </MainContainer>
    ) : (
        <NoContextModal
            what={" paziente e relativa visita "}
            service={" visualizzazione visita passata"}
        />
    );
}
