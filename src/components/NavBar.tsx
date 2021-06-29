import React from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { SearchOutlined, AddCircleOutlineOutlined } from "@material-ui/icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    toolBar: {
      display: "flex",
      justifyContent: "space-between",
    },
    logo: {
      width: "30px",
      height: "30px",
      backgroundColor: "red",
    },
    linksWrapper: {
      display: "flex",
      justifyContent: "space-between",
    },
    linkWrapper: {
      display: "flex",
      cursor: "pointer",
      alignItems: "center",
    },
    marginLeft: {
      marginLeft: theme.spacing(2),
    },
    avatar: {
      width: "30px",
      height: "30px",
      backgroundColor: "yellow",
    },
    searchTrips: { whiteSpace: "nowrap", paddingLeft: theme.spacing(0.5) },
  })
);
export function NavBar() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolBar}>
          <div className={classes.logo}></div>
          {isMobile ? (
            <>hi</>
          ) : (
            <>
              <div className={classes.linksWrapper}>
                <div className={classes.linkWrapper}>
                  <SearchOutlined />
                  <Typography variant="h6" className={classes.searchTrips}>
                    Search Trips
                  </Typography>
                </div>
                <div className={`${classes.linkWrapper} ${classes.marginLeft}`}>
                  <AddCircleOutlineOutlined />
                  <Typography variant="h6" className={classes.searchTrips}>
                    Add Trip
                  </Typography>
                </div>
              </div>
            </>
          )}
          <div className={classes.avatar}></div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
