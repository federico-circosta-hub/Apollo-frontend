import { Link, useNavigate } from "react-router-dom";
import newFile from "../../img/icon/new-file.png";
import newEvent from "../../img/icon/add-event.png";
import NewVisitModel from "../../Model/NewVisitModel";
import GenerateVisits from "../../Model/GenerateVisits";
import { useState, useEffect, useContext } from "react";
import VisitLine from "../OtherComponents/VisitLine";
import { VisitContext } from "../../Model/VisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import { NewVisitContext } from "../../Model/NewVisitContext";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function SearchVisit() {
    const [visitList, setVisitList] = useState([]);

    const { selectedVisit, setSelectedVisit } = useContext(VisitContext);
    const { selectedPatient } = useContext(PatientContext);

    const navigate = useNavigate();

    const { setNewVisit } = useContext(NewVisitContext);

    useEffect(() => {
        getVisits();
    }, []);

    const getVisits = () => {
        let arr = GenerateVisits();
        setVisitList(arr);
    };

    const handleSelect = () => {
        setTimeout(() => {
            navigate("/seeVisit");
        }, 200);
    };

    const createNewVisit = (b) => {
        let nv = new NewVisitModel();
        let pv = visitList.length > 0 ? visitList[0] : undefined
        nv.setPreviousVisit(pv);
        nv.setIsInPresence(b);
        nv.setPatient(selectedPatient.pid);
        setNewVisit(nv);
    };

    return selectedPatient !== null ? (
        <div>
            <div style={style.box}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingLeft: "2%",
                    }}
                >
                    <div>
                        <h2>Elenco visite:</h2>
                    </div>

                    <div style={{ display: "flex", gap: 20 }}>
                        <div>
                            <Link
                                to={"/newVisit"}
                                className="btn btn-primary btn-lg"
                                style={{ fontSize: 30 }}
                                onClick={() => createNewVisit(true)}
                            >
                                Nuova visita{" "}
                                <img
                                    src={newFile}
                                    alt="search"
                                    width={38}
                                    style={{ filter: "invert(100%)" }}
                                />
                            </Link>
                        </div>
                        <div>
                            <Link
                                to={"/newVisit"}
                                className="btn btn-primary btn-lg"
                                style={{ fontSize: 30 }}
                                onClick={() => createNewVisit(false)}
                            >
                                Trascrivi visita{" "}
                                <img
                                    src={newEvent}
                                    alt="search"
                                    width={38}
                                    style={{ filter: "invert(100%)" }}
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        height: "70vh",
                        overflow: "auto",
                        textAlign: "left",
                        borderRadius: "15px",
                        border: "0.5px solid black",
                    }}
                >
                    {visitList.map((visit, index) => (
                        <VisitLine
                            key={index}
                            visit={visit}
                            isSelected={visit === selectedVisit}
                            onSelectVisit={() => {
                                setSelectedVisit(visit);
                                handleSelect();
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    ) : (
        <NoContextModal what={" un paziente "} service={" ricerca visita "} />
    );
}

const style = {
    box: {
        width: "95%",
        height: "90vh",
        borderRadius: "15px",
        background: "white",
        margin: "auto",
        marginTop: "1%",
        display: "flex",
        flexDirection: "column",
        alignText: "left",
        alignItems: "left",
        padding: "1.5%",
        overflow: "auto",
        justifyContent: "space-around",
    },
};
