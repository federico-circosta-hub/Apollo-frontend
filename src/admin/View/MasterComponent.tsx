import List from "@mui/material/List";
import React, { ComponentType, useCallback, useState } from "react";
import { MasterItemProps } from "./MasterDetail";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export default function MasterComponent({
    items,
    Item,
    itemName,
    onItemClick,
    onAddClick,
}: {
    items: any[];
    Item: ComponentType<MasterItemProps>;
    itemName: string;
    onItemClick: (index: number) => void;
    onAddClick: () => void;
}) {
    const [filteredItems, setFilteredItems] = useState(items);

    const filterItems = useCallback(
        (text: string) => {
            setFilteredItems(items.filter((item) => item.filter(text)));
        },
        [items]
    );

    return (
        <>
            <Box sx={style.topBar}>
                <Search onChange={filterItems} />
                <Box sx={{ flex: 1 }} />
                <AddButton itemName={itemName} onClick={onAddClick} />
            </Box>
            <Box sx={style.scrollable}>
                <List sx={{ width: "100%" }}>
                    {filteredItems.map((item, index) => (
                        <>
                            <Item
                                key={index}
                                item={item}
                                onClick={() => onItemClick(index)}
                            />
                            <Divider />
                        </>
                    ))}
                </List>
            </Box>
        </>
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

const AddButton = ({
    itemName: title,
    onClick,
}: {
    itemName: string;
    onClick: () => void;
}) => {
    return (
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={style.addButton}
            onClick={onClick}
        >
            {title}
        </Button>
    );
};

const style = {
    scrollable: {
        width: "100%",
        overflow: "auto",
        flex: 1,
    },
    topBar: {
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
    },
    addButton: {
        marginTop: { xs: "16px", lg: "0px" },
    },
};
