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
import RemoveIcon from "@mui/icons-material/Remove";
import nameChecker from "../../ViewModel/NameChecker";

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
      props.setHomeRoute(true);
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
            width: "fit-content",
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
              <Divider />
              <ListItemButton
                onClick={() => {
                  if (!newVisit) navigate("/searchVisit", { replace: true });
                  setOpen(false);
                }}
                style={{
                  fontSize: 20,
                  background:
                    route.pathname === "/searchVisit" ? "lightblue" : "",
                }}
              >
                <ListItemIcon>
                  {newVisit ? <RemoveIcon /> : <AddIcon />}
                </ListItemIcon>
                {newVisit ? (
                  <>
                    Visita {format(newVisit.visitDate, "dd-MM-y")} {" - "}
                    {nameChecker(selectedPatient.name)}{" "}
                    {nameChecker(selectedPatient.surname)}
                  </>
                ) : (
                  <>Nuova Visita</>
                )}
              </ListItemButton>

              {newVisit && (
                <div style={{ paddingLeft: "15%" }}>
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
                </div>
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
