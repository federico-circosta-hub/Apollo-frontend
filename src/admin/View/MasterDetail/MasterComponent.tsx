import List from "@mui/material/List";
import React, { ComponentType, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmActionModal from "../../../common/View/Modal/ConfirmActionModal";
import AddButton from "../../Components/AddButton";

export type MasterItemProps = {
    item: any;
    onClick: () => void;
    onDelete?: () => void;
};

export default function MasterComponent({
    items,
    Item,
    itemName,
    onItemClick,
    onAdd,
    onDelete,
    deleteText,
}: {
    items: any[];
    Item: ComponentType<MasterItemProps>;
    itemName: string;
    onItemClick?: (index: number) => void;
    onAdd?: () => void;
    onDelete?: (item: any) => Promise<any>;
    deleteText?: string;
}) {
    const [filter, setFilter] = useState<string>("");
    const [selected, setSelected] = useState<number>(-1);
    const [deleteIndex, setDeleteIndex] = useState<number>(-1);

    const filterItems = useCallback(() => {
        return items.filter((item) => item.filter(filter));
    }, [items, filter]);

    const filteredItems = filterItems();

    return (
        <Box sx={style.box}>
            <Box sx={style.topBar}>
                <Search onChange={(text) => setFilter(text)} />
                <Box sx={{ flex: 1, height: 0 }} />
                {onAdd && (
                    <AddButton
                        itemName={itemName}
                        onAdd={onAdd}
                        style={style.addButton}
                    />
                )}
            </Box>
            <Box sx={style.scrollable}>
                <List sx={{ width: "100%" }}>
                    {filteredItems.map((item, index) => (
                        <Box
                            key={index}
                            sx={index === selected ? style.selected : undefined}
                        >
                            <Item
                                item={item}
                                onClick={() => {
                                    setSelected(index);
                                    onItemClick && onItemClick(index);
                                }}
                                onDelete={
                                    onDelete
                                        ? () => setDeleteIndex(index)
                                        : undefined
                                }
                            />
                            <Divider sx={style.divider} />
                        </Box>
                    ))}
                </List>
            </Box>
            <ConfirmActionModal
                text="Sei sicuro di voler eliminare questo elemento?"
                subtext={deleteText}
                show={deleteIndex >= 0}
                onConfirm={() => onDelete!(items[deleteIndex])}
                onClose={() => setDeleteIndex(-1)}
            />
        </Box>
    );
}

const Search = ({ onChange }: { onChange: (text: string) => void }) => {
    return (
        <TextField
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cerca"
            variant="standard"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

const style = {
    box: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
    },
    topBar: {
        height: "fit-content",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
    },
    addButton: {
        marginTop: { xs: "16px", lg: "0px" },
    },
    divider: {
        backgroundColor: "black",
    },
    selected: {
        backgroundColor: "#DDDDDD",
    },
};
