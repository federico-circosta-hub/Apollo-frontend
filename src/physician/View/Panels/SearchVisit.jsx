import { Link, useNavigate } from "react-router-dom";
import newFile from "../../img/icon/new-file.png";
import newEvent from "../../img/icon/add-event.png";
import NewVisitModel from "../../Model/NewVisitModel";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import VisitLine from "../OtherComponents/VisitLine";
import { VisitContext } from "../../Model/VisitContext";
import { PatientContext } from "../../Model/PatientContext";
import NoContextModal from "../Modals/NoContextModal";
import { NewVisitContext } from "../../Model/NewVisitContext";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import CircularProgress from "@mui/material/CircularProgress";
import MainContainer from "../../../common/View/MainContainer";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import { SkeletonsList } from "../OtherComponents/SkeletonsList";
import { TrendingUpRounded } from "@mui/icons-material";
import ExpostVisitServiceModal from "../Modals/ExpostVisitServiceModal";
import LiveVisitServiceModal from "../Modals/LiveVisitServiceModal";
import DeanonymizedCC from "../../../common/Model/Communication/DeanonymizedCommunicationController";

export default function SearchVisit(props) {
  const VISITS_AT_TIME = 20;
  const [visitList, setVisitList] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [showExpostServiceModal, setShowExpostServiceModal] = useState(false);
  const [showLiveServiceModal, setShowLiveServiceModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [endReached, setEndReached] = useState(false);

  const { selectedVisit, setSelectedVisit } = useContext(VisitContext);
  const { selectedPatient } = useContext(PatientContext);

  const throttledScroll = useRef(null);
  const navigate = useNavigate();

  const { setNewVisit } = useContext(NewVisitContext);

  useEffect(() => {
    selectedPatient && getVisits(0);
  }, []);

  const getVisits = async (offsetParam) => {
    //let visitsArray = GenerateVisits();
    let params = {
      patient: selectedPatient.pid,
      cnt: VISITS_AT_TIME,
      offset: offsetParam,
    };
    setLoadingVisits(true);
    setNetworkError(null);
    console.log(params);
    try {
      const visitsArray = await CommunicationController.get("visit", params);
      setOffset(offsetParam);
      if (visitsArray.length === 0 || visitsArray.length < VISITS_AT_TIME)
        setEndReached(true);
      if (visitsArray.length > 0) {
        for (let v of visitsArray) {
          const u = await DeanonymizedCC.get("user", {
            id: v.physician,
          });
          v.physicianName = u.name;
          v.physicianSurname = u.surname;
        }
        setVisitList((prevState) => [...prevState, ...visitsArray]);
      }
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (!endReached && (scrollTop + clientHeight) / scrollHeight >= 0.95) {
      if (!throttledScroll.current) {
        throttledScroll.current = setTimeout(() => {
          getVisits(offset + VISITS_AT_TIME);
          throttledScroll.current = null;
        }, 750);
      }
    }
  });

  const handleSelect = () => {
    setTimeout(() => {
      navigate("/seeVisit");
    }, 200);
  };

  const createNewVisit = (IsInPresence, visitId, visitDate) => {
    let nv = new NewVisitModel();
    nv.setPhysician(props.id);
    nv.setVisitId(visitId);
    nv.setIsInPresence(IsInPresence);
    nv.setPreviousVisitList(visitList);
    nv.setPatient(selectedPatient.pid);
    nv.setVisitDate(new Date(visitDate));
    setNewVisit(nv);
    console.log(nv);
    navigate("/newVisit", { replace: true });
  };

  return selectedPatient ? (
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
              <button
                className="btn btn-primary"
                style={{ fontSize: 24 }}
                onClick={() => setShowLiveServiceModal(true)}
              >
                Nuova visita{" "}
                <img
                  src={newFile}
                  alt="search"
                  width={38}
                  style={{ filter: "invert(100%)" }}
                />
              </button>
            </div>
            <div>
              <button
                className="btn btn-primary"
                style={{ fontSize: 24 }}
                onClick={() => setShowExpostServiceModal(true)}
              >
                Trascrivi visita{" "}
                <img
                  src={newEvent}
                  alt="search"
                  width={38}
                  style={{ filter: "invert(100%)" }}
                />
              </button>
            </div>
          </div>
        </div>

        <div
          onScroll={handleScroll}
          style={{
            width: "100%",
            height: "70vh",
            overflow: "auto",
            textAlign:
              visitList === null ||
              loadingVisits ||
              visitList.filter((e) => e.physician).length === 0
                ? "center"
                : "left",
            borderRadius: "15px",
            background:
              visitList === null ||
              visitList.filter((e) => e.physician).length === 0
                ? "#e8e8e8"
                : "white",
            border:
              visitList === null ||
              visitList.filter((e) => e.physician).length === 0
                ? "1px 2px 6px grey"
                : "1px 2px 6px #56AEC9",
            boxShadow:
              visitList === null ||
              visitList.filter((e) => e.physician).length === 0
                ? "1px 2px 6px #000000"
                : "1px 2px 6px #56AEC9",
          }}
        >
          {loadingVisits && <SkeletonsList />}
          {networkError !== null && (
            <div style={{ marginTop: "1%" }}>
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
              visitList !== null &&
              visitList.filter((e) => e.physician).length !== 0 && (
                <table className="table table-primary table-striped table-hover">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      height: "6vh",
                    }}
                  >
                    <tr style={{}}>
                      {/* <th
                        style={{
                          background: "white",
                          width: "15%",
                        }}
                      >
                        Id visita
                      </th> */}
                      <th
                        style={{
                          background: "white",
                          width: "30%",
                        }}
                      >
                        Data
                      </th>

                      <th
                        style={{
                          background: "white",
                          width: "35%",
                        }}
                      >
                        Medico
                      </th>
                      <th
                        style={{
                          background: "white",
                          width: "15%",
                        }}
                      >
                        Id medico
                      </th>
                      <th
                        style={{
                          background: "white",
                          width: "20%",
                        }}
                      >
                        Tipo visita
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {visitList
                      .filter(
                        (item, index, self) =>
                          index === self.findIndex((t) => t.id === item.id) &&
                          item.physician
                      )
                      .map((visit, index) => (
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
            {endReached &&
              visitList.filter((e) => e.physician !== null).length > 0 && (
                <tfoot
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  <p>
                    <em>Non sono presenti altre visite</em>
                  </p>
                </tfoot>
              )}

            {!loadingVisits &&
              networkError === null &&
              (visitList === null ||
                visitList.filter((e) => e.physician).length === 0) && (
                <h6 style={{ marginTop: "2%" }}>
                  <em>
                    Non sono presenti visite passate per{" "}
                    {selectedPatient.gender === "M" ? "il" : "la"} paziente{" "}
                    <strong>
                      {selectedPatient.name} {selectedPatient.surname}
                    </strong>
                  </em>
                </h6>
              )}
          </div>
        </div>
        <div>
          {showExpostServiceModal && (
            <ExpostVisitServiceModal
              onCancel={() => setShowExpostServiceModal(false)}
              onCreate={createNewVisit}
            />
          )}
        </div>
        <div>
          {showLiveServiceModal && (
            <LiveVisitServiceModal
              onCancel={() => setShowLiveServiceModal(false)}
              onCreate={createNewVisit}
            />
          )}
        </div>
      </MainContainer>
    </div>
  ) : (
    <NoContextModal what={" un paziente "} service={" ricerca visita "} />
  );
}
