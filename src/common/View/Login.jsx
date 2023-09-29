import { useContext, useState } from "react";
import unimi from "../img/logo_unimi.png";
import ospedale from "../img/ospedale-loghi.jpeg";
import UserContext from "../Model/UserContext";
import User, { UserType } from "../Model/User";

export default function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [display, setDisplay] = useState({ display: "none" });
    const [disabled, setDisabled] = useState(false);

    const [, setUser] = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);

        setTimeout(() => {
            if (username === "Federico" && password === "123") {
                setUser(
                    new User({
                        name: "Roberta",
                        surname: "Gualtierotti",
                        type: UserType.PHYSICIAN,
                        id: 23,
                        email: "test@test.it",
                        enabled: true,
                    })
                );
            } else {
                setDisplay({ display: "block" });
            }
            setDisabled(false);
        }, 2000);
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
                            type="text"
                            placeholder="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <input
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={disabled}
                            style={{ margin: "auto" }}
                        >
                            Login
                        </button>
                    </div>
                    <div
                        className="alert alert-warning"
                        role="alert"
                        style={display}
                    >
                        Credenziali errate
                    </div>
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
