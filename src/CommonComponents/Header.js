import NavDropdown from "react-bootstrap/NavDropdown";
import padlock from "../img/icon/padlock.png";

export default function Header({ name, title, logout, leftButton }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <nav class="navbar bg-body-tertiary">
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
                    <div>{leftButton != null ? leftButton : null}</div>
                    <div style={{ display: "flex" }}>
                        {title != null ? title : null}
                    </div>
                    <div style={{ display: "flex" }}>
                        <img
                            src={padlock}
                            width={22}
                            style={{ marginRight: 5 }}
                        />
                        <NavDropdown title={name}>
                            <button
                                onClick={logout}
                                style={{ margin: "auto" }}
                                class="btn btn-danger"
                            >
                                Logout
                            </button>
                        </NavDropdown>
                    </div>
                </div>
            </nav>
        </>
    );
}
