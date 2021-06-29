import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(8),
      width: "100%",
      height: "400px",
      backgroundColor: "pink",

      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(7),
      },
    },
  })
);
export const Banner = () => {
  const classes = useStyles();
  return <div className={classes.root}></div>;
};
