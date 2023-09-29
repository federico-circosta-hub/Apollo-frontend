import React, { ComponentType } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type DetailItemProps = {
    item: any;
};

export default function DetailComponent({
    item,
    Item,
}: {
    item: any;
    Item: ComponentType<DetailItemProps>;
}) {
    return item ? (
        <Box sx={style.scrollable}>
            <Item item={item} />
        </Box>
    ) : (
        <EmptyScreen />
    );
}

const EmptyScreen = () => {
    return (
        <Box sx={style.emptyScreen}>
            <Typography variant="h6" align="center">
                Seleziona un elemento dal menu a sinistra
            </Typography>
        </Box>
    );
};

const style = {
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        flex: 1,
        display: "flex",
    },
    emptyScreen: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column" as "column",
        margin: "auto",
    },
};
