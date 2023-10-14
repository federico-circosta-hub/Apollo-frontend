import { useContext, useState, useEffect } from "react";
import unimi from "../img/logo_unimi.png";
import ospedale from "../img/ospedale-loghi.jpeg";
import UserContext from "../Model/UserContext";
import User, { UserType } from "../Model/User";
import DeanonymizedCC from "../Model/Communication/DeanonymizedCommunicationController";
import Status from "../Model/Status";

export default function Login() {
    const [status, setStatus] = useState(Status.IDLE);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [, setUser] = useContext(UserContext);

    useEffect(() => {
        getUserFromLS();
    }, []);

    const getUserFromLS = async () => {
        const user = localStorage.getItem("user");
        if (user !== null) {
            const userObj = await JSON.parse(user);
            setUser(new User(userObj));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(Status.LOADING);

        try {
            const user = await DeanonymizedCC.login(email, password);
            setUser(user);
            setStatus(Status.IDLE);
        } catch (err) {
            setStatus(Status.ERROR);
        }
    };

    return (
        <div style={style.box}>
            <div style={{ paddingTop: "5%" }}>
                <h2>Autenticarsi</h2>
            </div>

            <br />

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
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <input
                            defaultValue={password}
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
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
                    {status === Status.ERROR && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                            style={{ textAlign: "center" }}
                        >
                            Email o password non corretti
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
    images: {
        padding: "3%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        justifyContent: "space-around",
        alignItems: "center",
    },
};
