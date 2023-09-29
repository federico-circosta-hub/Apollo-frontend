import CircularProgress from "@mui/material/CircularProgress";
import MainContainer from "./MainContainer";

export default function LoadingScreen() {
    return (
        <>
            <nav
                className="navbar bg-body-tertiary"
                style={{ height: "9vh" }}
            />
            <MainContainer>
                <CircularProgress style={{ margin: "auto" }} size={60} />
            </MainContainer>
        </>
    );
}
