import AppBar from "@mui/material/AppBar";
import LoadingScreen from "./LoadingScreen";

export default function StartupLoadingScreen() {
    return (
        <>
            <AppBar
                position="static"
                sx={{ height: "9vh", backgroundColor: "white" }}
            ></AppBar>
            <LoadingScreen />
        </>
    );
}
