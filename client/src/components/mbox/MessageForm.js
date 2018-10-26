import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";
import Typography from "@material-ui/core/Typography";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import axios from "axios";

const styles = theme => ({
  root: {
    width: "90%",
    padding: `${theme.spacing.unit * 2}px`,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    [theme.breakpoints.up("sm")]: {
      top: "20%",
      transform: "translate(-50%, 0)",
      width: "50%"
    },
    [theme.breakpoints.up("md")]: {
      width: "40%"
    },
    [theme.breakpoints.up("lg")]: {
      width: "30%"
    },
    [theme.breakpoints.up("xl")]: {
      width: "25%"
    }
  },
  heading: {
    marginBottom: `${theme.spacing.unit}px`
  },
  avatar: {
    margin: `${theme.spacing.unit}px auto`,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`
  }
});

export class MessageForm extends React.Component {
  constructor() {
    super();

    this.state = {
      title: "",
      body: "",
      snackbarVar: null,
      snackbarMessage: null,
      isSending: false
    };
  }

  onTitleChange = e => {
    this.setState({ title: e.target.value }, () => {});
  };

  onBodyChange = e => {
    this.setState({ body: e.target.value }, () => {});
  };

  onSubmit = e => {
    e.preventDefault();

    this.setState({ isSending: true }, async () => {
      try {
        await axios.post(`/api/message/new/${this.props.userId}`, {
          title: this.state.title,
          body: this.state.body
        });
        this.setState(
          {
            isSending: false,
            snackbarVar: "success",
            snackbarMessage: "Your message was sent successfully!"
          },
          () => {
            this.props.handleClose();
            this.props.onSnackbarSet(
              this.state.snackbarVar,
              this.state.snackbarMessage
            );
          }
        );
      } catch (e) {
        this.setState({
          snackbarVar: "error",
          snackbarMessage: "Something went wrong! Try again!"
        });
        this.props.onSnackbarSet(
          this.state.snackbarVar,
          this.state.snackbarMessage
        );
      }
    });
  };

  onSnackbarSet = () => {
    const { snackbarVar, snackbarMessage } = this.state;
    this.props.onSnackbarSet(snackbarVar, snackbarMessage);
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.heading}>
          <Avatar className={classes.avatar}>
            <MailOutlinedIcon />
          </Avatar>
          <Typography align="center" variant="headline">
            New Message
          </Typography>
        </div>
        <form className={classes.form} onSubmit={this.onSubmit}>
          <OutlinedInput
            labelWidth={-25}
            placeholder="Title"
            type="text"
            onChange={this.onTitleChange}
            inputProps={{ maxLength: 30 }}
            endAdornment={
              <InputAdornment position="end">
                {this.state.title.length}
                /30
              </InputAdornment>
            }
          />
          <OutlinedInput
            labelWidth={-25}
            multiline
            rows={3}
            onChange={this.onBodyChange}
            inputProps={{ maxLength: 120 }}
            endAdornment={
              <InputAdornment position="end">
                {this.state.body.length}
                /120
              </InputAdornment>
            }
          />
          <Button
            type="submit"
            variant="contained"
            disabled={
              this.state.isSending ||
              this.state.title.length < 1 ||
              this.state.body.length < 1
            }
          >
            <SendOutlinedIcon className={classes.leftIcon} />
            Send
          </Button>
        </form>
      </Paper>
    );
  }
}

MessageForm.propTypes = {
  userId: PropTypes.string.isRequired,
  withSnackbar: PropTypes.bool.isRequired,
  onSnackbarSet: PropTypes.func.isRequired
};

export default withStyles(styles)(MessageForm);