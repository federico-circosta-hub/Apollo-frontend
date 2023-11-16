import { Modal, Button } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import { useContext, useState } from "react";
import "react-day-picker/dist/style.css";
import { FormControl, InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "dayjs/locale/it";
import DeanonymizedCC from "../../../common/Model/Communication/DeanonymizedCommunicationController";
import UserContext from "../../../common/Model/UserContext";

export default function EditPswModal(props) {
  const [user] = useContext(UserContext);

  const [sendingButton, setSendingButton] = useState("Conferma");
  const [showAlert, setShowAlert] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const clear = () => {
    setOldPassword("");
    setNewPassword("");
    setNewPassword2("");
    setNetworkError(null);
    setDisabled(false);
    setShowAlert(null);
    props.setShow(false);
  };

  const handleModify = async () => {
    setSendingButton("Inviando");
    setDisabled(true);
    let params = {
      email: user.email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    try {
      await DeanonymizedCC.post("user/resetPassword", params);
      //console.log(params);
      clear();
    } catch (err) {
      setNetworkError(err);
      setShowAlert(false);
    } finally {
      setDisabled(false);
      setSendingButton("Conferma");
    }
  };

  return (
    <Modal show={props.show} animation={true}>
      <Alert severity="info" variant="filled" style={{ width: "100%" }}>
        <AlertTitle>Confermare modifica password</AlertTitle>
      </Alert>
      <Modal.Body style={{ background: "whitesmoke" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "1vh",
            marginTop: "4vh",
          }}
        >
          <FormControl
            sx={{ m: 1, width: "32ch", background: "white" }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Vecchia password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Vecchia password"
            />
          </FormControl>
          <FormControl
            sx={{ m: 1, width: "32ch", background: "white" }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password1">
              Nuova password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nuova password"
            />
          </FormControl>
          <FormControl
            sx={{ m: 1, width: "32ch", background: "white" }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password2">
              Ripeti nuova password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Ripeti nuova password"
            />
          </FormControl>
          <div style={{ height: "8vh" }}>
            {showAlert === false && (
              <Alert severity="error" variant="outlined">
                <AlertTitle>Errore nella richiesta</AlertTitle>
                Accertarsi della correttezza della vecchia password
              </Alert>
            )}
            {newPassword !== newPassword2 && (
              <Alert severity="warning" variant="outlined">
                La nuova password non corrisponde
              </Alert>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer
        style={{
          background: "whitesmoke",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button variant="secondary" onClick={clear} style={{ fontSize: 24 }}>
          Annulla
        </Button>
        <Button
          disabled={
            disabled ||
            newPassword !== newPassword2 ||
            oldPassword === "" ||
            newPassword === ""
          }
          onClick={() => {
            handleModify();
          }}
          variant="success"
          style={{ fontSize: 24 }}
        >
          {networkError ? "Riprova" : sendingButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
