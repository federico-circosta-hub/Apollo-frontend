import MainContainer from "./MainContainer";
import Loading from "./Loading";

export default function LoadingScreen() {
    return (
        <>
            <nav
                className="navbar bg-body-tertiary"
                style={{ height: "9vh" }}
            />
            <MainContainer>
                <Loading />
            </MainContainer>
        </>
    );
}
