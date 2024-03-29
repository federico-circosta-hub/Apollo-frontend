import List from "@mui/material/List";
import React, { ComponentType, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmActionModal from "../../../common/View/Modal/ConfirmActionModal";
import AddButton from "../../Components/AddButton";

export type MasterItemProps = {
    item: any;
    index: number;
    onClick: () => void;
    onDelete?: () => void;
};

export default function MasterComponent({
    items,
    Item,
    itemName,
    index,
    onItemClick,
    onAdd,
    onDelete,
    deleteText,
    style,
}: {
    items: any[];
    Item: ComponentType<MasterItemProps>;
    itemName: string;
    index?: number;
    onItemClick?: (index: number) => void;
    onAdd?: () => void;
    onDelete?: (item: any) => Promise<any>;
    deleteText?: string;
    style?: any;
}) {
    const [filter, setFilter] = useState<string>("");
    const [selected, setSelected] = useState<number>(index ?? -1);
    const [deleteIndex, setDeleteIndex] = useState<number>(-1);

    const filterItems = useCallback(() => {
        return items.filter((item) => item.filter(filter));
    }, [items, filter]);

    useEffect(() => {
        setSelected(index ?? -1);
    }, [index]);

    const filteredItems = filterItems();

    return (
        <Box sx={[baseStyle.box, style]}>
            <Box sx={baseStyle.topBar}>
                <Search onChange={(text) => setFilter(text)} />
                <Box sx={{ flex: 1, height: 0 }} />
                {onAdd && (
                    <AddButton
                        itemName={itemName}
                        onAdd={onAdd}
                        style={baseStyle.addButton}
                    />
                )}
            </Box>
            <Box sx={baseStyle.scrollable}>
                <List sx={{ width: "100%" }}>
                    {filteredItems.map((item, i) => (
                        <Box
                            key={i}
                            sx={i === selected ? baseStyle.selected : undefined}
                        >
                            <Item
                                item={item}
                                index={i}
                                onClick={() =>
                                    onItemClick
                                        ? onItemClick(i)
                                        : setSelected(i)
                                }
                                onDelete={
                                    onDelete
                                        ? () => setDeleteIndex(i)
                                        : undefined
                                }
                            />
                            <Divider sx={baseStyle.divider} />
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

const baseStyle = {
    box: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
    },
    scrollable: {
        marginTop: "2px",
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
