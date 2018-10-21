import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    height: "32px",
    width: "32px"
  }
});

// ionicon
export const GoogleIcon = props => {
  const { classes } = props;
  return (
    <svg
      className={classes.root}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M457.6 224l-2.1-8.9H262V297h115.6c-12 57-67.7 87-113.2 87-33.1 0-68-13.9-91.1-36.3-23.7-23-38.8-56.9-38.8-91.8 0-34.5 15.5-69 38.1-91.7 22.5-22.6 56.6-35.4 90.5-35.4 38.8 0 66.6 20.6 77 30l58.2-57.9c-17.1-15-64-52.8-137.1-52.8-56.4 0-110.5 21.6-150 61C72.2 147.9 52 204 52 256s19.1 105.4 56.9 144.5c40.4 41.7 97.6 63.5 156.5 63.5 53.6 0 104.4-21 140.6-59.1 35.6-37.5 54-89.4 54-143.8 0-22.9-2.3-36.5-2.4-37.1z" />
    </svg>
  );
};

export default withStyles(styles)(GoogleIcon);
