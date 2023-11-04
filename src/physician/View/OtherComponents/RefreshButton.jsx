import { Button, CircularProgress } from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

export const RefreshButton = ({ onClick, loading }) => {
  return (
    <div
      style={{
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        endIcon={<RefreshOutlinedIcon />}
        onClick={onClick}
        disabled={loading}
        style={{ margin: "10px" }}
      >
        {loading ? (
          <CircularProgress
            size={20}
            style={{ alignItems: "center" }}
            color="inherit"
          />
        ) : (
          <>ricarica</>
        )}
      </Button>
    </div>
  );
};
