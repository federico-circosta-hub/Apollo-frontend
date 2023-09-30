import { Link, useNavigate } from "react-router-dom";
import newFile from "../../img/icon/new-file.png";
import newEvent from "../../img/icon/add-event.png";
import NewVisitModel from "../../Model/NewVisitModel";
import { useState, useEffect, useContext } from "react";
import VisitLine from "../OtherComponents/VisitLine";
import { VisitContext } from "../../Model/VisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import { NewVisitContext } from "../../Model/NewVisitContext";
import CommunicationController from "../../../common/Model/CommunicationController";
import CircularProgress from "@mui/material/CircularProgress";
import MainContainer from "../../../common/View/MainContainer";
import { RefreshButton } from "../OtherComponents/RefreshButton";

export default function SearchVisit() {
    const [visitList, setVisitList] = useState([]);
    const [loadingVisits, setLoadingVisits] = useState(false);
    const [networkError, setNetworkError] = useState(null);

    const { selectedVisit, setSelectedVisit } = useContext(VisitContext);
    const { selectedPatient } = useContext(PatientContext);

    const navigate = useNavigate();

    const { setNewVisit } = useContext(NewVisitContext);

    useEffect(() => {
        getVisits();
    }, []);

    const clearAll = () => {
        setVisitList([]);
        setNetworkError(null);
    };

    const getVisits = async () => {
        //let visitsArray = GenerateVisits();
        setLoadingVisits(true);
        clearAll();
        try {
            const visitsArray = await CommunicationController.get("visit", {
                patient: selectedPatient.pid,
            });
            setVisitList(visitsArray);
        } catch (err) {
            setNetworkError(err || "Errore inatteso");
        } finally {
            setLoadingVisits(false);
        }
    };

    const handleSelect = () => {
        setTimeout(() => {
            navigate("/seeVisit");
        }, 200);
    };

    const createNewVisit = (IsInPresence) => {
        let nv = new NewVisitModel();
        let pv = visitList.length > 0 ? visitList[0] : undefined;
        nv.setPreviousVisit(pv);
        nv.setIsInPresence(IsInPresence);
        nv.setPatient(selectedPatient.pid);
        setNewVisit(nv);
    };

    return selectedPatient !== null ? (
        <div>
            <MainContainer>
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
                                className="btn btn-primary"
                                style={{ fontSize: 24 }}
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
                                className="btn btn-primary"
                                style={{ fontSize: 24 }}
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
                        width: "100%",
                        height: "70vh",
                        overflow: "auto",
                        textAlign:
                            loadingVisits || visitList.length === 0
                                ? "center"
                                : "left",
                        borderRadius: "15px",
                        background:
                            visitList.length === 0 ? "#e8e8e8" : "white",
                        border:
                            visitList.length === 0
                                ? "1px 2px 6px grey"
                                : "1px 2px 6px #56AEC9",
                        boxShadow:
                            visitList.length === 0
                                ? "1px 2px 6px #000000"
                                : "1px 2px 6px #56AEC9",
                    }}
                >
                    {loadingVisits && <CircularProgress />}
                    {networkError !== null && (
                        <div style={{ marginTop: "1%" }}>
                            {console.log(networkError)}
                            Errore nell'ottenere lista visite
                            <RefreshButton
                                onClick={() => {
                                    getVisits();
                                }}
                            />
                        </div>
                    )}
                    <div>
                        {!loadingVisits &&
                            networkError === null &&
                            visitList.length > 0 && (
                                <table className="table table-primary table-striped table-hover">
                                    <thead
                                        style={{
                                            position: "sticky",
                                            top: 0,
                                            height: "6vh",
                                        }}
                                    >
                                        <tr>
                                            <th style={{ background: "white" }}>
                                                Id visita
                                            </th>
                                            <th style={{ background: "white" }}>
                                                Data
                                            </th>
                                            <th style={{ background: "white" }}>
                                                Medico
                                            </th>
                                            <th style={{ background: "white" }}>
                                                Tipo visita
                                            </th>
                                        </tr>
                                    </thead>

                  <tbody>
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
                  </tbody>
                </table>
              )}
            {!loadingVisits &&
              networkError === null &&
              visitList.length === 0 && (
                <h6 style={{ marginTop: "2%" }}>
                  <em>
                    Non sono presenti visite per il paziente{" "}
                    <strong>
                      {selectedPatient.name} {selectedPatient.surname}
                    </strong>
                  </em>
                </h6>
              )}
          </div>
        </div>
      </MainContainer>
    </div>
  ) : (
    <NoContextModal what={" un paziente "} service={" ricerca visita "} />
  );
}
