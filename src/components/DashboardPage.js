import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";
import { Card } from "@mui/material";
import { CardActions } from "@mui/material";
import { CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import baseUrl from "../global";
import Footer from "./Footer";

const DashboardPage = () => {
  
  const [name, setname] = useState("");
  const [rooms, setrooms] = useState([]);
  const [uid, setuid] = useState("");
  const [spotifyAutenticated, setspotifyAuthenticated] = useState(false)

  function authenticateSpotify() {
    fetch(baseUrl+"/spotify/is-authenticated")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
        if (data.status === false) {
          
          fetch(baseUrl+"/spotify/get-auth-url")
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              window.location.replace(data.url);
            });
        }
        setspotifyAuthenticated(data.status);
      });
  }

  function retrieveRooms() {
    const requestOptions = {
      method: "GET",   
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
    };
    fetch(baseUrl+"/api/person-rooms",requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let foundRooms = [];
        for (let index = 1; index < data.length; index++) {
          const newRoom = {
            roomCode: data[index].code,
            createdAt: data[index].created_at,
            guestCanPause: data[index].guest_can_pause,
            votesToSkip: data[index].votes_to_skip,
            isHost: data[index].host === data[0].uid,
            hostName: data[index].host_name,
            guests: data[index].guests
              .map((element) => element.name)
              .filter((name) => name != data[index].host_name),
          };
          foundRooms.push(newRoom);
        }
        setrooms(foundRooms);
        setuid(data[0].uid);
        setname(data[0].name);
      });
  }

  useEffect(() => {
    retrieveRooms();
    //authenticateSpotify();
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
  

  if (name === "") {
    return <CircularProgress color="primary" />;
  } else {
    var cards = rooms.map((room) => {
      return (
        <Grid item xs={4} align="center">
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {room.roomCode}
              </Typography>
              <Typography variant="h5" component="h2">
                Host: {room.hostName}
              </Typography>
              {room.guests.length === 0 && (
                <Typography variant="h6" component="h2">
                  No Guests
                </Typography>
              )}
              {room.guests.length > 0 && (
                <Typography
                  variant="h6"
                  component="h2"
                  className={
                    room.guests.length === 0 ? classes.hide : classes.show
                  }
                >
                  Guests: {room.guests.toString()}
                </Typography>
              )}

              <Typography className={classes.pos} color="textSecondary">
                Votes to Skip: {room.votesToSkip}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Guests can pause/play: {room.guestCanPause.toString()}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Created at: {(room.createdAt.split('T')[0]).split("-")[2]}/{(room.createdAt.split('T')[0]).split("-")[1]}/{(room.createdAt.split('T')[0]).split("-")[0]}
              </Typography>


            </CardContent>
            <CardActions
            style={{justifyContent:'center'}}
            >

            
            <Button
                align="center"
                color="primary"
                variant="contained"
                to={"/room/"+room.roomCode}
                component={Link}
              >
                Go to Room
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });

    return (
      <Grid container spacing={3}>
        {/* First Grid Element: Title */}

        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Welcome, {name}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            {cards}
          </Grid>
        </Grid>
        <Grid item xs={12}>
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
                to="/create"
                component={Link}
              >
                Create a Room
              </Button>
            </Grid>

            <Grid item xs={6} align="start">
              <Button
                color="secondary"
                variant="contained"
                to="/join"
                component={Link}
              >
                Join New Room
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} align="center">
        </Grid>

        
      </Grid>
    );
  }
};
export default DashboardPage;
