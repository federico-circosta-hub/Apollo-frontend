import JointNameChanger from "../../../ViewModel/JointNameChanger";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import format from "date-fns/format";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import CommunicationController from "../../../../common/Model/Communication/MainCommunicationController";
import { Skeletons } from "../Skeletons";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { RefreshButton } from "../RefreshButton";
import { Modal } from "react-bootstrap";

export default function JointInfo(props) {
  const [ecographies, setEcographies] = useState([]);
  const [loadingEcographies, setLoadingEcographies] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(null);
  const [selectedEco, setSelectedEco] = useState(null);

  const jointToDisplay = props.selectedJoint;

  useEffect(() => {
    getEcographies();
  }, [props.selectedJoint]);

  const getEcographies = async () => {
    let a = [];
    setEcographies(a);
    setLoadingEcographies(true);
    setNetworkError(null);
    try {
      const imgsBase64 = await Promise.all(
        jointToDisplay.media_ids.imgs.map(async (e) => {
          const eco = await CommunicationController.get("media/base64", {
            id: e,
          });
          console.log(eco);
          return eco;
        })
      );
      const videosBase64 = await Promise.all(
        jointToDisplay.media_ids.videos.map(async (e) => {
          const eco = await CommunicationController.get("media/base64", {
            id: e,
            videoFormat: "mp4",
          });
          console.log(eco);
          return eco;
        })
      );
      setEcographies([...imgsBase64, ...videosBase64]);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingEcographies(false);
    }
  };

  const valueResolver = (s) => {
    switch (s) {
      case "sinovite":
        switch (jointToDisplay.sinovite) {
          case 0:
            return "Assente/bassa";
          case 1:
            return "Media";
          case 2:
            return "Grave";
        }
      case "cartilagine":
        switch (jointToDisplay.cartilagine) {
          case 0:
            return "Normale";
          case 1:
            return "Perdita <25%";
          case 2:
            return "Perdita <50%";
          case 3:
            return "Perdita <50%";
          case 4:
            return "Perdita totale";
        }
      case "subchondral":
        switch (jointToDisplay.subchondral_bone) {
          case 0:
            return "Normale";
          case 1:
            return "Irregolarità medie";
          case 2:
            return "Osteofite";
        }
      case "distension":
        switch (jointToDisplay.distension_amount) {
          case "absent":
            return "Assente";
          case "minimum":
            return "Leggera";
          case "moderate":
            return "Media";
          case "severe":
            return "Grave";
        }
      case "distensionCause":
        return jointToDisplay.blood
          ? props.distensionCauseValues.filter(
              (e) => e.id === jointToDisplay.blood
            )[0].name
          : "N/A";
    }
  };

  function createData(key, value) {
    return { key, value };
  }

  const rows = [
    createData("Index Joint:", jointToDisplay.index_joint ? "Sì" : "No"),
    createData(
      "Difficoltà di movimento:",
      jointToDisplay.difficulty_moving ? "Sì" : "No"
    ),
    createData("Dolore:", jointToDisplay.pain ? "Sì" : "No"),
    createData(
      "Ultimo sanguinamento:",
      jointToDisplay.last_bleeding
        ? format(new Date(jointToDisplay.last_bleeding), "y-MM-dd")
        : "N/A"
    ),
    createData("Sinovite:", valueResolver("sinovite")),
    createData("Cartilagine:", valueResolver("cartilagine")),
    createData("Osso subcondrale:", valueResolver("subchondral")),
    createData("Livello di distensione:", valueResolver("distension")),
    props.distensionCauseValues.length > 0 ? (
      createData("Causa distensione:", valueResolver("distensionCause"))
    ) : props.loadingCauses ? (
      <CircularProgress />
    ) : (
      <RefreshButton onClick={props.get} />
    ),
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h4>
        {JointNameChanger.fromSeparateEnglishToSingleStringIta(
          jointToDisplay.name,
          jointToDisplay.side
        )}
      </h4>
      <TableContainer style={{ width: "75%" }} component={Paper}>
        <Table aria-label="simple table">
          <TableBody style={{ fontSize: 20 }}>
            {rows.map((row) => (
              <TableRow
                key={row.key}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                  fontSize: 20,
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontSize: 20, fontWeight: "700" }}
                >
                  {row.key}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontSize: 20, fontWeight: "500" }}
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          marginTop: "5vh",
          width: "100%",
        }}
      >
        <h4>Ecografie:</h4>
        {loadingEcographies && <Skeletons />}

        {networkError !== null && (
          <>
            <Alert severity="error" variant="filled" style={{ width: "100%" }}>
              <AlertTitle>Errore di rete, riprovare</AlertTitle>
            </Alert>
            <RefreshButton onClick={getEcographies} />
          </>
        )}

        <div>
          {!loadingEcographies &&
            !networkError &&
            ecographies.length > 0 &&
            ecographies.map((item, index) => (
              <>
                {item.type === "image" && (
                  <img
                    key={index}
                    src={item.base64}
                    style={{ width: "100%", margin: 5 }}
                    onClick={() => {
                      setSelectedEco(item);
                      setShowPhotoModal(true);
                    }}
                  />
                )}
                {item.type === "video" && (
                  <video
                    key={index}
                    autoPlay
                    width={"100%"}
                    controls
                    loop
                    /* onClick={() => {
                      setSelectedEco(item);
                      setShowPhotoModal(true);
                    }} */
                  >
                    <source src={item.base64} type="video/mp4" />
                  </video>
                )}
                <Modal
                  fullscreen={true}
                  show={showPhotoModal}
                  onHide={() => setShowPhotoModal(false)}
                  centered
                >
                  <Modal.Body>
                    {selectedEco && selectedEco.type === "image" && (
                      <img
                        src={selectedEco && selectedEco.base64}
                        alt={"Ecografia"}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                        onClick={() => {
                          setShowPhotoModal(false);
                        }}
                      />
                    )}
                    {/* {selectedEco && selectedEco.type === "video" && (
                      <video
                        width={"100%"}
                        controls
                        onClick={() => {
                          setShowPhotoModal(false);
                        }}
                      >
                        <source
                          src={selectedEco && selectedEco.base64}
                          type="video/mp4"
                        />
                      </video>
                    )} */}
                  </Modal.Body>
                </Modal>
              </>
            ))}
        </div>

        {ecographies.length === 0 &&
          !loadingEcographies &&
          networkError === null && (
            <Alert severity="info" variant="filled" style={{ width: "100%" }}>
              <AlertTitle>
                <em>Non sono presenti ecografie</em>
              </AlertTitle>
            </Alert>
          )}
      </div>
    </div>
  );
}
