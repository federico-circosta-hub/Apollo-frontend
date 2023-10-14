import { useCallback, useContext } from "react";
import AccountMenu from "./AccountMenu";
import { useNavigate } from "react-router-dom";
import UserContext from "../Model/UserContext";
import DeanonymizedCC from "../Model/Communication/DeanonymizedCommunicationController";

export default function Header({ title, leftButton }) {
    const navigate = useNavigate();
    const [, setUser] = useContext(UserContext);

    const onLogout = useCallback(async () => {
        await DeanonymizedCC.logout();
        setUser(null);
        navigate("/");
    }, [setUser, navigate]);

    return (
        <nav className="navbar bg-body-tertiary" style={{ height: "9vh" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    paddingLeft: "1%",
                    paddingRight: "1%",
                }}
            >
                <div>{leftButton}</div>
                <div style={{ display: "flex" }}>
                    {title != null ? title : null}
                </div>
                <div style={{ display: "flex" }}>
                    <AccountMenu onLogout={onLogout} />
                </div>
            </div>
        </nav>
    );
}
