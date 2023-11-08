import { Modal } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { RefreshButton } from "../OtherComponents/RefreshButton";
import {
  CircularProgress,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
} from "@mui/material";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import { NewVisitContext } from "../../Model/NewVisitContext";
import JointNameChanger from "./../../ViewModel/JointNameChanger";

export default function ChangingJointFieldMediaModal(props) {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const [displayScan, setDisplayScan] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [scanItems, setScanItems] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [sended, setSended] = useState(null);
  const [sending, setSending] = useState(null);

  useEffect(() => {
    console.log(props.savedJointName);
    if (!props.savedJointName || props.savedJointName === "other" || props.scan)
      setDisplayScan(true);
    getScanTypesFromServer();
  }, []);

  const handleSubmit = async () => {
    setSending(true);
    setNetworkError(null);
    try {
      const patch = { id: props.id, scan: selectedOption };
      await CommunicationController.patch("media/scan", patch);
      props.setJointField(props.id, props.actualJointName, selectedOption);
      props.setScan(false);
      props.setShow(false);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
      setSended(false);
    } finally {
      setSending(false);
    }
  };

  const handleSelectOption = (e) => {
    setSelectedOption(e.target.value);
  };

  const getScanTypesFromServer = async () => {
    setLoadingOptions(true);
    setScanItems([]);
    setNetworkError(null);
    let params = { joint: props.actualJointName };
    try {
      const st = await CommunicationController.get("scan", params);
      setScanItems(st);
      setSelectedOption(st[0].name);
    } catch (err) {
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoadingOptions(false);
    }
  };

  const cancel = () => {
    let newPhotos = [...props.photos];
    newPhotos.forEach((e) => {
      if (e.id === props.id) {
        e.realJoint = undefined;
        e.realSide = undefined;
      }
    });
    props.setScan(false);
    props.setPhotos(newPhotos);
    props.setShow(false);
  };

  const displayScanItems = () => {
    return networkError === null && scanItems !== null ? (
      scanItems.map((element) => (
        <MenuItem key={element.name} value={element.name}>
          {element.name.includes("other") ? "Altro" : element.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem>
        Errore nell'ottenere i tipi di scan
        <RefreshButton onClick={getScanTypesFromServer} />
      </MenuItem>
    );
  };

  return (
    <Modal show={props.show} animation={true}>
      <Alert severity="warning" variant="filled">
        <AlertTitle>
          {displayScan ? "Selezionare scan" : "Attenzione!"}
        </AlertTitle>
      </Alert>

      <Modal.Body style={{ background: "whitesmoke" }}>
        {displayScan ? (
          <Select
            value={
              selectedOption !== null
                ? selectedOption
                : "Selezionare un'opzione"
            }
            style={{ fontSize: 22, width: "50%" }}
            id="demo-simple-select"
            onChange={handleSelectOption}
          >
            {loadingOptions && (
              <CircularProgress style={{ padding: 2 }} color="info" size={25} />
            )}
            {!loadingOptions && displayScanItems()}
          </Select>
        ) : (
          <>
            {props.savedJointName && (
              <p>
                Questa immagine è stata annotata come{" "}
                {JointNameChanger.fromEngToItaName(
                  props.savedJointName
                ).toLowerCase()}
                .
              </p>
            )}
            {props.actualJointName && (
              <p>
                Sei sicuro di volerla selezionare come{" "}
                {JointNameChanger.fromEngToItaName(
                  props.actualJointName
                ).toLowerCase()}
                ?
              </p>
            )}
          </>
        )}
        {sended === false && (
          <Alert severity="error">
            <AlertTitle>Errore nell'invio!</AlertTitle>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer style={{ background: "whitesmoke" }}>
        {displayScan ? (
          <>
            {" "}
            <button
              className="btn btn-secondary"
              onClick={() => {
                cancel();
              }}
            >
              Annulla
            </button>
            <button
              disabled={sending}
              className={
                sended === false ? "btn btn-outline-danger" : "btn btn-primary"
              }
              onClick={() => {
                handleSubmit();
              }}
            >
              {sended === false ? "Riprova" : "Conferma"}
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                cancel();
              }}
            >
              No
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setDisplayScan(true);
              }}
            >
              Sì
            </button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
