import { useContext, useState, useEffect } from "react";
import unimi from "../img/logo_unimi.png";
import ospedale from "../img/ospedale-loghi.jpeg";
import UserContext from "../Model/UserContext";
import DeanonymizedCC from "../Model/Communication/DeanonymizedCommunicationController";
import Status from "../Model/Status";
import config from "../../config";
import { CircularProgress } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";

export default function Login() {
  const [status, setStatus] = useState(Status.IDLE);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [networkError, setNetworkError] = useState(null);

  const [, setUser] = useContext(UserContext);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setStatus(Status.LOADING);

    try {
      const user = await DeanonymizedCC.login(email, password);
      setUser(user);
      setStatus(Status.IDLE);
    } catch (err) {
      setNetworkError(err);
      setStatus(Status.ERROR);
      localStorage.removeItem(config.LOCAL_STORAGE_SESSION_KEY);
      localStorage.removeItem(config.LOCAL_STORAGE_EXPIRE_KEY);
    }
  };

  const getUserFromLS = async () => {
    const expireDate = Date.parse(
      localStorage.getItem(config.LOCAL_STORAGE_EXPIRE_KEY)
    );
    if (expireDate > Date.now()) {
      handleSubmit();
    } else {
      localStorage.removeItem(config.LOCAL_STORAGE_SESSION_KEY);
      localStorage.removeItem(config.LOCAL_STORAGE_EXPIRE_KEY);
    }
  };

  useEffect(() => {
    getUserFromLS();
  }, []);

  return (
    <div style={style.box}>
      <div style={{ paddingTop: "5%", flex: 1 }}>
        <h2>Autenticarsi</h2>
      </div>

      <div style={style.images}>
        <div>
          <img
            src={unimi}
            alt="Logo dell'università degli studi di Milano"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src={ospedale}
            alt="Logo dell'ospedale policlinico di Milano"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        </div>
      </div>
      <div style={{ flex: 0.75 }}>
        {status === Status.ERROR && (
          <Alert severity="error" variant="filled" style={{ width: "100%" }}>
            <AlertTitle>
              {networkError.response
                ? networkError.response.data.message.includes("user")
                  ? "Utente inesistente"
                  : networkError.response.data.message.includes("password")
                  ? "Password non corretta"
                  : "Errore di rete"
                : "Errore di rete"}
            </AlertTitle>
            {console.log(networkError)}
          </Alert>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 2,
        }}
      >
        {status === Status.LOADING ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                defaultValue={email}
                type="text"
                placeholder="email"
                onChange={(e) => {
                  setStatus(Status.IDLE);
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="input-group mb-3">
              <input
                defaultValue={password}
                type="password"
                placeholder="password"
                onChange={(e) => {
                  setStatus(Status.IDLE);
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="input-group mb-3">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={status === Status.LOADING}
                style={{ margin: "auto" }}
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const style = {
  box: {
    width: "40%",
    padding: "3vh",
    height: "80vh",
    borderRadius: "15px",
    background: "white",
    margin: "auto",
    marginTop: "10vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignText: "center",
    alignItems: "center",
  },
  images: {
    padding: "3%",
    flex: 2,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    justifyContent: "space-around",
    alignItems: "center",
  },
};
