import { useContext, useState, useEffect } from "react";
import unimi from "../img/logo_unimi.png";
import ospedale from "../img/ospedale-loghi.jpeg";
import UserContext from "../Model/UserContext";
import User, { UserType } from "../Model/User";
import CommunicationController from "./../Model/CommunicationController";

export default function Login() {
  const [email, setEmail] = useState("test@test.it");
  const [password, setPassword] = useState("test@test.it");
  const [networkError, setNetworkError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [, setUser] = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    let u = null;
    try {
      u = await CommunicationController.post("user/login", {
        email: email,
        password: password,
      });
      setUser(new User(u));
    } catch (err) {
      console.log(err);
      setNetworkError(err || "Errore inatteso");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div style={style.box}>
      <div style={{ paddingTop: "5%" }}>
        <h2>Autenticarsi</h2>
      </div>

      <br />

      <div
        style={{
          padding: "3%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div>
          <img
            src={unimi}
            alt="logo_unimi"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src={ospedale}
            alt="logo_unimi"
            style={{ maxWidth: "90%", height: "auto" }}
          />
        </div>
      </div>
      <br />
      <br />
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              defaultValue={email}
              type="text"
              placeholder="email"
              onChange={(e) => {
                setEmail(e.target.value);
                setNetworkError(null);
              }}
            />
          </div>
          <div className="input-group mb-3">
            <input
              defaultValue={password}
              type="password"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setNetworkError(null);
              }}
            />
          </div>
          <div className="input-group mb-3">
            <button
              className="btn btn-primary"
              type="submit"
              loginLoading={loginLoading}
              style={{ margin: "auto" }}
            >
              Login
            </button>
          </div>
          {networkError !== null && (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ textAlign: "center" }}
            >
              {networkError.response !== undefined
                ? networkError.response.data.message
                : "Errore di rete"}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const style = {
  box: {
    width: "40%",
    height: "fit-content",
    borderRadius: "15px",
    background: "white",
    margin: "auto",
    marginTop: "10%",
    display: "flex",
    flexDirection: "column",
    alignText: "center",
    alignItems: "center",
  },
};
