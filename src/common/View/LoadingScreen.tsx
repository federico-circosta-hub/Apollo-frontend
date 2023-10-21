import AppBar from "@mui/material/AppBar";
import MainContainer from "./MainContainer";
import Loading from "./Loading";

export default function LoadingScreen() {
    return (
        <>
            <AppBar
                position="static"
                sx={{ height: "9vh", backgroundColor: "white" }}
            ></AppBar>
            <MainContainer>
                <Loading />
            </MainContainer>
        </>
    );
}
