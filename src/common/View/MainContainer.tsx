export default function MainContainer({ children }: { children: any }) {
    return (
        <div className="box-bianco" style={style.box}>
            {children}
        </div>
    );
}

const style = {
    box: {
        width: "95%",
        height: "88vh",
        borderRadius: "15px",
        backgroundColor: "white",
        margin: "auto",
        marginTop: "1.5vh",
        marginBottom: "1.5vh",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        padding: "5vh",
    },
};
