import React, { ComponentType } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type DetailItemProps = {
    item: any;
};

export default function DetailComponent({
    item,
    Item,
    style,
}: {
    item: any;
    Item: ComponentType<DetailItemProps>;
    style?: any;
}) {
    return item ? (
        <Box sx={[baseStyle.scrollable, style]}>
            <Item item={item} />
        </Box>
    ) : (
        <EmptyScreen style={style} />
    );
}

const EmptyScreen = ({ style }: { style?: any }) => {
    return (
        <Box sx={[baseStyle.emptyScreen, style]}>
            <Typography variant="h6" align="center">
                Seleziona un elemento dal menu a sinistra
            </Typography>
        </Box>
    );
};

const baseStyle = {
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
