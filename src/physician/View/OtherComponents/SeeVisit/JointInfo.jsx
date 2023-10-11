import JointNameChanger from "../../../ViewModel/JointNameChanger";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import CommunicationController from "./../../../../common/Model/CommunicationController";
import { Skeletons } from "../Skeletons";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { RefreshButton } from "../RefreshButton";

export default function JointInfo(props) {
  const [ecographies, setEcographies] = useState([]);
  const [loadingEcographies, setLoadingEcographies] = useState(false);
  const [networkError, setNetworkError] = useState(null);

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
      const updatedEcographies = await Promise.all(
        jointToDisplay.media_ids.map(async (e) => {
          const eco = await CommunicationController.get("media", { id: e });
          return eco;
        })
      );
      setEcographies(updatedEcographies);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingEcographies(false);
    }
  };

  const valueResolver = (s) => {
    let result = "";
    switch (s) {
      case "sinovite":
        switch (jointToDisplay.sinovite) {
          case 0:
            result = "Assente/bassa";
          case 1:
            result = "Media";
          case 2:
            result = "Grave";
        }

        return result;
      case "cartilagine":
        switch (jointToDisplay.cartilagine) {
          case 0:
            result = "Normale";
          case 1:
            result = "Perdita <25%";
          case 2:
            result = "Perdita <50%";
          case 3:
            result = "Perdita <50%";
          case 4:
            result = "Perdita totale";
        }
        return result;
      case "subchondral":
        switch (jointToDisplay.subchondral_bone) {
          case 0:
            result = "Normale";
          case 1:
            result = "Irregolarità medie";
          case 2:
            result = "Osteofite";
        }
        return result;
      case "distension":
        switch (jointToDisplay.distension_amount) {
          case "absent":
            result = "Assente";
          case "minimum":
            result = "Leggera";
          case "moderate":
            result = "Media";
          case "severe":
            result = "Grave";
        }
        return result;
      case "distensionCause":
        switch (jointToDisplay.blood) {
          case 1:
            result = "Unclear";
          case 2:
            result = "Synovial Effusion";
          case 4:
            result = "Synovial Effusion + Synovial Hyperplasia";
          case 5:
            result = "Vacuum";
          case 3:
            result = "Synovial Hyperplasia";
          case 6:
            result = "Vacuum + Synovial Hyperplasia";
          default:
            result = "N/A";
        }
        return result;
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
      jointToDisplay.last_bleeding !== null
        ? jointToDisplay.last_bleeding
        : "N/A"
    ),
    createData("Sinovite:", valueResolver("sinovite")),
    createData("Cartilagine:", valueResolver("cartilagine")),
    createData("Osso subcondrale:", valueResolver("subchondral")),
    createData("Livello di distensione:", valueResolver("distension")),
    createData("Causa distensione:", valueResolver("distensionCause")),
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
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
                  "&:last-child td, &:last-child th": { border: 0 },
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
            networkError === null &&
            ecographies.map((item, index) => (
              <img
                key={index}
                src={item.base64}
                style={{ width: "100%", margin: 5 }}
              />
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
