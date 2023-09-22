import { Collapse } from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import baseUrl from "../global";
import Footer from "./Footer";
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
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
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
    
  }

  function handleGuestCanPauseChange(e) {
    setguestCanPause(e.target.value === "true" ? true : false);
  }

  function handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch(baseUrl+"/api/create-room", requestOptions)
      .then((response) => {
        
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
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
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
        <Grid item xs={12} align="center">
        <Footer></Footer>
        </Grid>
      </Grid>

    );
  }
};

export default CreateRoomPage;
