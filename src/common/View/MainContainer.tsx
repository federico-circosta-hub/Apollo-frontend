import Box from "@mui/material/Box";

export default function MainContainer({
    children,
    style,
}: {
    children?: any;
    style?: any;
}) {
    return (
        <Box className="box-bianco" sx={[baseStyle.box, style]}>
            {children}
        </Box>
    );
}

const baseStyle = {
    box: {
        backgroundColor: "white",
        width: "95%",
        height: "88vh",
        borderRadius: "15px",
        margin: "auto",
        marginTop: "1.5vh",
        marginBottom: "1.5vh",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        gap: "1vh",
        padding: "5vh",
    },
};
