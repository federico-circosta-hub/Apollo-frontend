import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Fade from "@mui/material/Fade";
import { ListItemIcon } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { PatientContext } from "../../Model/PatientContext";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export default function PositionedMenu(props) {
    const route = useLocation();
    const { selectedPatient } = React.useContext(PatientContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <MenuIcon />
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {selectedPatient != null ? (
                    <MenuItem
                        onClick={() => {
                            props.setShowModal(true);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <CancelOutlinedIcon />
                        </ListItemIcon>
                        Termina con {selectedPatient.name}{" "}
                        {selectedPatient.surname}
                    </MenuItem>
                ) : route.pathname === "/annotations" ? (
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <HomeOutlinedIcon />
                        </ListItemIcon>
                        <Link to={"/"}>Home</Link>
                    </MenuItem>
                ) : (
                    route.pathname === "/" && (
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <NoteAltOutlinedIcon />
                            </ListItemIcon>
                            <Link to={"/annotations"}>Annotazioni</Link>
                        </MenuItem>
                    )
                )}
            </Menu>
        </>
    );
}
