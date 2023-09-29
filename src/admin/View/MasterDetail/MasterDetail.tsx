import { ComponentType, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import MasterComponent, { MasterItemProps } from "./MasterComponent";
import Divider from "@mui/material/Divider";
import MainContainer from "../../../common/View/MainContainer";
import Loading from "../../../common/View/Loading";
import DetailComponent, { DetailItemProps } from "./DetailComponent";
import { useNavigate } from "react-router-dom";
import Status from "../../../common/Model/Status";
import ErrorScreen from "./ErrorScreen";

export default function MasterDetail({
    items,
    itemName,
    addRoute,
    MasterItem,
    DetailItem,
    status,
    onRetry,
}: {
    items: any[];
    itemName: string;
    addRoute: string;
    MasterItem: ComponentType<MasterItemProps>;
    DetailItem: ComponentType<DetailItemProps>;
    status: Status;
    onRetry: () => Promise<void>;
}) {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number>(-1);

    const onAddClick = useCallback(() => {
        navigate(addRoute);
    }, [navigate, addRoute]);

    if (status === Status.ERROR) return <ErrorScreen onRetry={onRetry} />;

    return (
        <MainContainer style={style.outerBox}>
            <Box sx={style.listBox}>
                {status === Status.IDLE ? (
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
