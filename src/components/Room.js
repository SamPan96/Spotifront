import { Grid, responsiveFontSizes } from "@mui/material";
import { Box, Card } from "@mui/material";
import { CardActions } from "@mui/material";
import { CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import baseUrl from "../global";
import CreateRoomPage from "./CreateRoomPage";
import Footer from "./Footer";
import LoginPage from "./LoginPage";
import MusicPlayer from "./MusicPlayer";
import SearchBar from "./SearchBar";

export default function Room(props) {
  const [roomData, setRoomData] = useState({
    roomExists: false,
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    createdAt: "",
    isHost: false,
    code: "",
  });
  const [spotifyAuthenticated, setspotifyAuthenticated] = useState(false);
  const [displaySettings, setdisplaySettings] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    isLogged: false,
  });
  const [song, setsong] = useState({});
  const [uid, setuid] = useState("");

  let { roomCode } = useParams();
  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
    crossDomain: "true",
    body: {},
  };

  function checkLogin() {
    let requestOptions = {
      method: "POST",
      credentials: "include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json"},
      body: {},
    };
    fetch(baseUrl + "/api/check-login", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          setLoginInfo({
            isLogged: true,
          });
          return response.json();
        } else {
          setLoginInfo({
            isLogged: false,
          });
        }
      })
      .then((data) => setuid(data.uid));
  }

  function authenticateSpotify() {
    let requestOptions = {
      method: "GET",
      credentials: "include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json"},
    };

    fetch(baseUrl + "/spotify/is-authenticated", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setspotifyAuthenticated(data.status);
        if (data.status === false) {
          let requestOptions = {
            method: "GET",
            credentials: "include",
            crossDomain: "true",
            headers: { "Content-Type": "application/json"},
          };
          fetch(baseUrl + "/spotify/get-auth-url", requestOptions)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  function HandleSettingsClicked() {
    setdisplaySettings(true);
  }
  function HandleCloseSettingsClicked() {
    setdisplaySettings(false);
  }

  function retrieveRoom() {
    let requestOptions = {
      method: "GET",
      credentials: "include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json"},
    };

    fetch(baseUrl + "/api/get-room" + "?code=" + roomCode, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data === undefined) {
          setRoomData({
            roomExists: false,
          });
        } else {
          let guests = [];
          for (let index = 0; index < data.guests.length; index++) {
            guests.push(data.guests[index].name);
          }
          setRoomData({
            roomExists: true,
            code: data.code,
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            guests: guests.filter((name) => name != data.host_name),
            hostName: data.host_name,
            createdAt: data.created_at,
            isHost: data.is_host,
          });
          if (data.is_host) {
            authenticateSpotify();
          }
        }
      });
  }

  function getCurrentSong() {
    let requestOptions = {
      method: "GET",
      credentials: "include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json"},
    };

    fetch(
      baseUrl + "/spotify/current-song?room_code=" + roomCode,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setsong(data);
      });
  }

  useEffect(() => {
    checkLogin();
    retrieveRoom();
    setInterval(getCurrentSong, 1000);
    return () => {};
  }, []);

  const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    hide: {
      display: "none",
    },

    show: {},
  });

  const classes = useStyles;

  if (loginInfo.isLogged) {
    if (roomData.roomExists === true) {
      return (
        <Grid container spacing={3} align="center">
          <Grid item xs={12} align="center">
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {roomCode}
                </Typography>

                <Typography variant="h5" component="h2">
                  Host: {roomData.hostName}
                </Typography>
                {roomData.guests.length === 0 && (
                  <Typography variant="h6" component="h2">
                    No Guests
                  </Typography>
                )}
                {roomData.guests.length > 0 && (
                  <Typography
                    variant="h6"
                    component="h2"
                    className={
                      roomData.guests.length === 0 ? classes.hide : classes.show
                    }
                  >
                    Guests: {roomData.guests.toString()}
                  </Typography>
                )}

                <SearchBar {...{ room_code: roomCode }}></SearchBar>



                <MusicPlayer
                  {...{
                    song: song,
                    room_code: roomCode,
                    votes_to_skip: roomData.votesToSkip,
                    uid: uid,
                  }}
                ></MusicPlayer>

                {displaySettings === true && (
                  <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                      <CreateRoomPage
                        update={true}
                        votesToSkip={roomData.votesToSkip}
                        guestCanPause={roomData.guestCanPause}
                        code={roomData.code}
                        updateCallback={retrieveRoom}
                      />
                    </Grid>

                    <Grid item xs={12} align="center">
                      <Button
                        align="center"
                        color="secondary"
                        variant="contained"
                        onClick={HandleCloseSettingsClicked}
                      >
                        Close Settings
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </CardContent>

              {displaySettings === false && roomData.isHost === false && (
                <Button
                  align="center"
                  color="primary"
                  variant="contained"
                  to={"/"}
                  component={Link}
                >
                  Back
                </Button>
              )}

              {displaySettings === false && roomData.isHost === true && (
                <Box m={3} pt={0}>
                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={6} align="end">
                      <Button
                        color="primary"
                        variant="contained"
                        to="/"
                        component={Link}
                      >
                        Back
                      </Button>
                    </Grid>
                    <Grid item xs={6} align="start">
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={HandleSettingsClicked}
                      >
                        Settings
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </Grid>
          <Footer></Footer>
        </Grid>

      );
    } else {
      return <h3>Room {roomCode} does not exist!</h3>;
    }
  } else {
    return <LoginPage />;
  }
}
