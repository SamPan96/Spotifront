import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <Typography color="primary" gutterBottom>
          Made with
        </Typography>
      </Grid>
      <Grid item>
        <FavoriteBorderIcon color="secondary"></FavoriteBorderIcon>
      </Grid>
      <Grid item>
        <Typography color="primary" gutterBottom>
          By SamPan96 
        </Typography>
      </Grid>
    </Grid>
  );
}
