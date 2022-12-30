import React from "react";
import {Grid} from "@mui/material";

interface AnyChildren {
  children: React.ReactNode;
}

function ScreenGrid({children}: AnyChildren) {
  return (
    <Grid container height="100vh" justifyContent="center" alignItems="center" flexDirection="column">
      {children}
    </Grid>
  );
}

export default ScreenGrid;
