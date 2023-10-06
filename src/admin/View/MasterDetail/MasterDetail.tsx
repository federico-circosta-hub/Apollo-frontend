import { ComponentType, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MasterComponent, { MasterItemProps } from "./MasterComponent";
import Divider from "@mui/material/Divider";
import MainContainer from "../../../common/View/MainContainer";
import Loading from "../../../common/View/Loading";
import DetailComponent, { DetailItemProps } from "./DetailComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import Status from "../../../common/Model/Status";
import ErrorScreen from "../../../common/View/ErrorScreen";
import EmptyScreen from "./EmptyScreen";

export default function MasterDetail({
    items,
    itemName,
    addRoute,
    MasterItem,
    DetailItem,
    status,
    onRetry,
    onDelete,
    deleteText,
}: {
    items: any[];
    itemName: string;
    addRoute: string;
    MasterItem: ComponentType<MasterItemProps>;
    DetailItem: ComponentType<DetailItemProps>;
    status: Status;
    onRetry: () => Promise<void>;
    onDelete?: (item: any) => Promise<any>;
    deleteText?: string;
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedIdStr = parseInt(searchParams.get("id") ?? "");
    const selectedId = isNaN(selectedIdStr) ? -1 : selectedIdStr;

    const navigate = useNavigate();
    const [selected, setSelected] = useState<number>(-1);

    const onAdd = useCallback(() => {
        navigate(addRoute);
    }, [navigate, addRoute]);

    useEffect(() => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === selectedId) {
                setSelected(i);
                return;
            }
        }
    }, [selectedId, items]);

    if (status === Status.ERROR) return <ErrorScreen onRetry={onRetry} />;
    if (status !== Status.LOADING && items.length === 0)
        return <EmptyScreen itemName={itemName} onAdd={onAdd} />;

    return (
        <MainContainer style={style.outerBox}>
            <Box sx={style.listBox}>
                {status === Status.IDLE ? (
                    <MasterComponent
                        items={items}
                        itemName={itemName}
                        Item={MasterItem}
                        index={selected}
                        onItemClick={(index) => setSelected(index)}
                        onAdd={onAdd}
                        onDelete={onDelete}
                        deleteText={deleteText}
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
