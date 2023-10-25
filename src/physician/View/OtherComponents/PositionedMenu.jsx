import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddIcon from "@mui/icons-material/Add";
import { Button, Divider } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PatientContext } from "../../Model/PatientContext";
import { NewVisitContext } from "../../Model/NewVisitContext";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PanToolAltOutlinedIcon from "@mui/icons-material/PanToolAltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import format from "date-fns/format";
import { StepContext } from "../../Model/StepContext";

export default function PositionedMenu(props) {
  const navigate = useNavigate();
  const route = useLocation();
  const { selectedPatient, setSelectedPatient } =
    React.useContext(PatientContext);
  const { newVisit } = React.useContext(NewVisitContext);
  const { completedStep, setCompletedStep } = React.useContext(StepContext);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const handleHome = () => {
    setOpen(false);
    if (newVisit) {
      props.setShowModal(true);
    } else {
      setSelectedPatient(null);
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon />
      </Button>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "25vw",
          },
        }}
      >
        <List>
          {route.pathname !== "/annotations" && (
            <>
              <ListItemButton
                onClick={handleHome}
                style={{
                  fontSize: 20,
                  background: route.pathname === "/" ? "lightblue" : "",
                }}
              >
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                Home
              </ListItemButton>
              <Divider />
              {route.pathname === "/" && (
                <ListItemButton
                  onClick={() => {
                    navigate("/annotations", { replace: true });
                    setOpen(false);
                  }}
                  style={{
                    fontSize: 20,
                  }}
                >
                  <ListItemIcon>
                    <NoteAltOutlinedIcon />
                  </ListItemIcon>
                  Annotazioni
                </ListItemButton>
              )}
              <ListItemButton
                onClick={() => {
                  navigate("/newPatient");
                  setOpen(false);
                }}
                style={{
                  fontSize: 20,
                  background:
                    route.pathname === "/newPatient" ? "lightblue" : "",
                }}
              >
                <ListItemIcon>
                  <PersonAddAlt1Icon />
                </ListItemIcon>
                Nuovo paziente
              </ListItemButton>
              <ListItemButton
                disabled={newVisit}
                onClick={() => {
                  navigate("/searchVisit", { replace: true });
                  setOpen(false);
                }}
                style={{
                  fontSize: 20,
                  background:
                    route.pathname === "/searchVisit" ? "lightblue" : "",
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                Nuova Visita
              </ListItemButton>

              {newVisit && (
                <>
                  <Divider />
                  <label
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: 20,
                      color: "gray",
                    }}
                  >
                    Visita {format(newVisit.visitDate, "dd-MM-y")}
                  </label>
                  <ListItemButton
                    onClick={() => {
                      navigate("/newVisit", { replace: true });
                      setOpen(false);
                    }}
                    style={{
                      fontSize: 20,
                      background:
                        route.pathname === "/newVisit" ? "lightblue" : "",
                    }}
                  >
                    <ListItemIcon>
                      <MonitorHeartOutlinedIcon />
                    </ListItemIcon>
                    Anamnesi
                  </ListItemButton>
                  <ListItemButton
                    disabled={!completedStep[0]}
                    onClick={() => {
                      navigate("/newVisit/jointSelection", { replace: true });
                      setOpen(false);
                    }}
                    style={{
                      fontSize: 20,
                      background:
                        route.pathname === "/newVisit/jointSelection"
                          ? "lightblue"
                          : "",
                    }}
                  >
                    <ListItemIcon>
                      <PanToolAltOutlinedIcon />
                    </ListItemIcon>
                    Selezione articolazione
                  </ListItemButton>
                  <ListItemButton
                    disabled={!completedStep[1]}
                    onClick={() => {
                      navigate("/newVisit/drug", { replace: true });
                      setOpen(false);
                    }}
                    style={{
                      fontSize: 20,
                      background:
                        route.pathname === "/newVisit/drug" ? "lightblue" : "",
                    }}
                  >
                    <ListItemIcon>
                      <VaccinesIcon />
                    </ListItemIcon>
                    Farmaci
                  </ListItemButton>
                  <ListItemButton
                    disabled={!newVisit.sended}
                    onClick={() => {
                      navigate("/newVisit/endVisit", { replace: true });
                      setOpen(false);
                    }}
                    style={{
                      fontSize: 20,
                      background:
                        route.pathname === "/newVisit/endVisit"
                          ? "lightblue"
                          : "",
                    }}
                  >
                    <ListItemIcon>
                      <DescriptionOutlinedIcon />
                    </ListItemIcon>
                    Report
                  </ListItemButton>
                </>
              )}
            </>
          )}
          {route.pathname === "/annotations" && (
            <ListItemButton
              onClick={() => {
                navigate("/", { replace: true });
                setOpen(false);
              }}
            >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              Home
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </>
  );
}
