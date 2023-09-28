import { ComponentType, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import MasterComponent from "./MasterComponent";
import Divider from "@mui/material/Divider";
import MainContainer from "../../common/View/MainContainer";
import Loading from "../../common/View/Loading";
import DetailComponent from "./DetailComponent";
import { useNavigate } from "react-router-dom";

export type MasterItemProps = {
    key: number;
    item: any;
    onClick: () => void;
};

export type DetailItemProps = {
    item: any;
};

export type Status = "loaded" | "loading" | "error";

export default function MasterDetail({
    items,
    itemName,
    addRoute,
    MasterItem,
    DetailItem,
    status,
}: {
    items: any[];
    itemName: string;
    addRoute: string;
    MasterItem: ComponentType<MasterItemProps>;
    DetailItem: ComponentType<DetailItemProps>;
    status: Status;
}) {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number>(-1);

    const onAddClick = useCallback(() => {
        navigate(addRoute);
    }, [navigate, addRoute]);

    return (
        <MainContainer style={style.outerBox}>
            <Box sx={style.listBox}>
                {status === "loaded" ? (
                    <MasterComponent
                        items={items}
                        itemName={itemName}
                        Item={MasterItem}
                        onItemClick={(index) => setSelected(index)}
                        onAddClick={onAddClick}
                    />
                ) : (
                    <Loading />
                )}
            </Box>
            <Divider orientation="vertical" flexItem sx={style.divider} />
            <Box sx={style.detailsBox}>
                <DetailComponent
                    Item={DetailItem}
                    item={selected >= 0 ? items[selected] : null}
                />
            </Box>
        </MainContainer>
    );
}

const style = {
    outerBox: {
        display: "flex",
        flexDirection: "row",
    },
    listBox: {
        height: "100%",
        flex: 5,
        marginRight: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column" as "column",
    },
    detailsBox: {
        height: "100%",
        flex: 11,
        display: "flex",
        marginLeft: "16px",
    },
    divider: {
        backgroundColor: "black",
    },
};
