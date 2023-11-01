import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import Status from "../../../common/Model/Status";
import MainContainer from "../../../common/View/MainContainer";
import MainCC from "../../../common/Model/Communication/MainCommunicationController";
import {
    MediaStats,
    MediaType,
    StatsKeys,
} from "../../../common/Model/Dataset";
import LoadingError from "../../../common/View/LoadingError";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ErrorScreen from "../../../common/View/ErrorScreen";

function getPercent(a: number, b: number) {
    if (b === 0) return "0%";
    return Math.round((a / b) * 10000) / 100 + "%";
}

function upperCaseFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function AdminMediaStats() {
    const [, setTitle] = useContext(HeaderContext);
    useEffect(() => {
        setTitle("Statistiche");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.LOADING);

    const [stats, setStats] = useState<MediaStats>();

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await MainCC.getMediaStats();

            setStats(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, []);

    useEffect(() => {
        fetchData();
        return () => CommunicationController.abortLast();
    }, [fetchData]);

    if (status !== Status.IDLE || !stats)
        return <ErrorScreen onRetry={fetchData} />;

    return (
        <MainContainer>
            <List component="div" sx={style.scrollableList}>
                <ImgItem stats={stats} />
                <Box sx={{ m: 4 }} />
                <VideoItem stats={stats} />
            </List>
        </MainContainer>
    );
}

const ImgItem = ({ stats }: { stats: MediaStats }) => {
    return <BaseItem stats={stats} type={MediaType.IMAGE} />;
};

const VideoItem = ({ stats }: { stats: MediaStats }) => {
    return <BaseItem stats={stats} type={MediaType.VIDEO} />;
};

const BaseItem = ({ stats, type }: { stats: MediaStats; type: MediaType }) => {
    const suffix = type === MediaType.IMAGE ? "Imgs" : "Videos";

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={type === MediaType.IMAGE ? "Immagini" : "Video"}
                    primaryTypographyProps={{ fontWeight: "bold" }}
                />
                <ListItemText
                    primary={stats[("valid" + suffix) as StatsKeys]}
                    secondary={`Valide: ${getPercent(
                        stats[("valid" + suffix) as StatsKeys],
                        stats[("tot" + suffix) as StatsKeys]
                    )}`}
                    sx={style.percentText}
                />
                <ListItemIcon>
                    <ExpandMore sx={{ color: "white" }} />
                </ListItemIcon>
            </ListItem>
            <List component="div" disablePadding>
                {Object.keys(stats.joints).map((joint, index) => (
                    <JointItem
                        key={index}
                        joint={joint}
                        stats={stats}
                        type={type}
                    />
                ))}
            </List>
        </>
    );
};

const JointItem = ({
    joint,
    stats,
    type,
}: {
    joint: string;
    stats: MediaStats;
    type: MediaType;
}) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

    const jointData = stats.joints[joint];
    const suffix = type === MediaType.IMAGE ? "Imgs" : "Videos";

    return (
        <>
            <ListItemButton onClick={toggleOpen}>
                <ListItemText
                    primary={`Articolazione: ${upperCaseFirst(joint)}`}
                    sx={style.jointText}
                />
                <ListItemText
                    primary={jointData[("valid" + suffix) as StatsKeys]}
                    secondary={`Valide: ${getPercent(
                        jointData[("valid" + suffix) as StatsKeys],
                        stats[("tot" + suffix) as StatsKeys]
                    )}`}
                    sx={style.jointPercentText}
                />
                <ListItemIcon>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
            </ListItemButton>
            <Divider sx={style.divider} />
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {Object.keys(jointData.scans).map((scan, index) => (
                        <ScanItem
                            key={index}
                            joint={joint}
                            scan={scan}
                            stats={stats}
                            type={type}
                        />
                    ))}
                </List>
            </Collapse>
        </>
    );
};

const ScanItem = ({
    scan,
    joint,
    stats,
    type,
}: {
    scan: string;
    joint: string;
    stats: MediaStats;
    type: MediaType;
}) => {
    const scanData = stats.joints[joint].scans[scan];

    const suffix = type === MediaType.IMAGE ? "Imgs" : "Videos";

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={`Scan: ${upperCaseFirst(scan)}`}
                    sx={style.scanText}
                />
                <ListItemText
                    primary={scanData[("valid" + suffix) as StatsKeys]}
                    secondary={`Valide: ${getPercent(
                        scanData[("valid" + suffix) as StatsKeys],
                        stats[("tot" + suffix) as StatsKeys]
                    )}`}
                    sx={style.scanPercentText}
                />
                <ListItemIcon>
                    <ExpandMore sx={{ color: "white" }} />
                </ListItemIcon>
            </ListItem>
            <Divider sx={style.divider} />
        </>
    );
};

const style = {
    scrollableList: {
        width: "100%",
        overflow: "auto",
        height: "100%",
    },
    percentText: {
        textAlign: "right",
        paddingRight: "32px",
    },
    jointPercentText: {
        textAlign: "right",
        paddingRight: "32px",
    },
    scanPercentText: {
        textAlign: "right",
        paddingRight: "32px",
    },
    divider: {
        backgroundColor: "black",
    },
    jointText: {
        paddingLeft: "32px",
    },
    scanText: {
        paddingLeft: "64px",
    },
};
