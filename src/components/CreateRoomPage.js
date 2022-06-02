import { Collapse } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import baseUrl from "../global";
import LoginPage from "./LoginPage";

const CreateRoomPage = (props) => {
  const defaultVotes = props.votesToSkip ? props.votesToSkip : 2;
  const defaultGuestCanPause = props.guestCanPause
    ? props.guestCanPause
    : false;
  const editMode = props.update ? true : false;
  const roomCode = props.code ? props.code : "";
  const [votesToSkip, setvotesToSkip] = useState(defaultVotes);
  const [guestCanPause, setguestCanPause] = useState(defaultGuestCanPause);
  const [isLogged, setisLogged] = useState("false");
  const [error, seterror] = useState("");
  const [successMessage, setsuccessMessage] = useState("");
  const navigate = useNavigate();

  function checkLogin() {
    let requestOptions = {
      method: "POST",
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json" },
      body: {},
    };
    if (isLogged === "true") {
      return;
    } else {
      fetch(baseUrl+"/api/check-login", requestOptions).then((response) => {
        if (response.status === 200) {
          setisLogged("true");
        } else {
          setisLogged("false");
        }
      });
    }
  }

  function handleVotesChange(e) {
    setvotesToSkip(e.target.value);
    console.log(votesToSkip);
  }

  function handleGuestCanPauseChange(e) {
    setguestCanPause(e.target.value === "true" ? true : false);
  }

  function handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch(baseUrl+"/api/create-room", requestOptions)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        navigate("/room/" + data.code);
      });
  }

  function handleEditRoomButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    fetch(baseUrl+"/api/update-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          setsuccessMessage("Room Updated");
        } else {
          seterror("Room Could not be updated");
        }
        props.updateCallback();
      })
      .catch((e) => {
        console.log(e);
        seterror(e.message);
      });
  }

  useEffect(() => {
    checkLogin();
    return () => {};
  }, []);

  if (isLogged === "false") {
    return <LoginPage />;
  } else {
    return (
      <Grid justifyContent="center" alignItems="center" container spacing={1}>
        {/* First Grid Element: Title */}

        <Grid item xs={6} align="center">
          <Collapse
            align="center"
            in
            {...(successMessage != "" || error != "")}
          >
            {successMessage != "" && (
              <Alert
                align="center"
                severity="success"
                onClose={() => {
                  setsuccessMessage("");
                }}
              >
                {successMessage}
              </Alert>
            )}
            {error != "" && (
              <Alert
                severity="error"
                onClose={() => {
                  seterror("");
                }}
              >
                {error}
              </Alert>
            )}
          </Collapse>
        </Grid>

        <Grid item xs={12} align="center">
          {editMode === false && (
            <Typography component="h5" variant="h5">
              Create a Room
            </Typography>
          )}
          {editMode === true && (
            <Typography component="h5" variant="h5">
              Edit Room Settings
            </Typography>
          )}
        </Grid>

        {/* Second Grid Element: radio buttons */}

        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
              <RadioGroup
                row
                defaultValue={defaultGuestCanPause.toString()}
                onChange={handleGuestCanPauseChange}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color="primary"></Radio>}
                  label="Play/Pause"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color="secondary"></Radio>}
                  label="No Control"
                  labelPlacement="bottom"
                />
              </RadioGroup>
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Third textField */}

        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              onChange={handleVotesChange}
              type="number"
              defaultValue={defaultVotes}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Votes Required to Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* 4th Element  */}

        <Grid item xs={12}>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={12} align="center">
              {editMode === false && (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleRoomButtonPressed}
                >
                  Create a Room
                </Button>
              )}
              {editMode === true && (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleEditRoomButtonPressed}
                >
                  Edit Room Settings
                </Button>
              )}
            </Grid>
            {editMode === false && (
              <Grid item xs={12} align="center">
                <Button
                  color="secondary"
                  variant="contained"
                  to="/"
                  component={Link}
                >
                  Back
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default CreateRoomPage;
