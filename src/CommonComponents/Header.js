import AccountMenu from "./AccountMenu";

export default function Header({ name, title, logout, leftButton }) {
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
                        <AccountMenu name={name} logout={logout} />
                    </div>
                </div>
            </nav>
        </>
    );
}
