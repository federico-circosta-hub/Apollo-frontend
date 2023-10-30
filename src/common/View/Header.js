import { useCallback, useContext } from "react";
import AccountMenu from "./AccountMenu";
import { useNavigate } from "react-router-dom";
import UserContext from "../Model/UserContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DeanonymizedCC from "../Model/Communication/DeanonymizedCommunicationController";

export default function Header({ title, leftButton }) {
  const navigate = useNavigate();
  const [, setUser] = useContext(UserContext);

  const onLogout = useCallback(async () => {
    await DeanonymizedCC.logout();
    setUser(null);
    navigate("/", { replace: true });
  }, [setUser, navigate]);

  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={style.container}>
        {leftButton || <Box />}
        {title && (
          <Typography
            variant="h6"
            color="black"
            component="div"
            sx={style.title}
          >
            {title}
          </Typography>
        )}

        <AccountMenu onLogout={onLogout} />
      </Toolbar>
    </AppBar>
  );
}

const style = {
  container: {
    height: "9vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft: "1%",
    paddingRight: "1%",
    backgroundColor: "white",
  },
  title: {
    textAlign: "center",
    userSelect: "none",
  },
};
