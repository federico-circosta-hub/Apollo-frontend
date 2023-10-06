import { useContext, useState, useEffect } from "react";
import { VisitContext } from "../../Model/VisitContext";
import { format } from "date-fns";
import it from "date-fns/locale/it";
import NoContextModal from "../Modals/NoContextModal";
import VisitObjectGenerator from "../../Model/VisitObjectGenerator";
import { useNavigate } from "react-router-dom";
import CommunicationController from "../../../common/Model/CommunicationController";
import MainContainer from "../../../common/View/MainContainer";
import VisitInfo from "../OtherComponents/SeeVisit/VisitInfo";
import JointInfo from "../OtherComponents/SeeVisit/JointInfo";
import JointNameChanger from "../../ViewModel/JointNameChanger";

export default function SeeVisit() {
  const { selectedVisit } = useContext(VisitContext);
  const [visit, setVisit] = useState(null);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const [selectedJoint, setSelectedJoint] = useState(null);

  useEffect(() => {
    loadVisit();
  }, []);

  const loadVisit = async () => {
    setLoadingVisit(true);
    try {
      const visitObject = await CommunicationController.get("visit/details", {
        id: selectedVisit.id,
      });
      console.log(visitObject);
      setVisit(visitObject);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingVisit(false);
    }
  };

  const navigate = useNavigate();

  return selectedVisit !== null ? (
    <MainContainer>
      {loadingVisit && visit === null && <h3>Loading...</h3>}
      {!loadingVisit && visit !== null && networkError === null && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              background: selectedJoint !== null ? "#1e90ff" : "#2f4f4f",
              width: "100%",
              height: "5vh",
              alignItems: "center",
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
                border: "1px solid lightgray",
                borderRadius: 15,
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "2vh",
                  background: selectedJoint === null ? "#2f4f4f" : "white",
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
                        selectedJoint === item.name + " " + item.side
                          ? "#1e90ff"
                          : "white",
                      borderRadius: 15,
                    }}
                  >
                    <button
                      onClick={() =>
                        selectedJoint !== item.name + " " + item.side
                          ? setSelectedJoint(item.name + " " + item.side)
                          : setSelectedJoint(null)
                      }
                      className={
                        selectedJoint != item.name + " " + item.side
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
                height: "75vh",
                border: "1px solid gray",
                padding: "1.5%",
                borderRadius: 15,
              }}
            >
              <div>
                {selectedJoint !== null && visit !== null ? (
                  <JointInfo visit={visit} selectedJoint={selectedJoint} />
                ) : (
                  <VisitInfo visit={visit} />
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              className="btn btn-danger btn-lg"
              onClick={() => {
                navigate(-1);
              }}
            >
              Chiudi visualizzazione
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
