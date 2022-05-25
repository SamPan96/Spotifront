import { CircularProgress } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { CardActions } from "@material-ui/core";
import { CardContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import baseUrl from "../global";

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
        console.log(data)
        if (data.status == false) {
          console.log('in here')
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
      crossDomain: "true",
      credentials:"include",
      headers: { "Content-Type": "application/json" },
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
            isHost: data[index].host == data[0].uid,
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
  console.log(rooms);

  if (name == "") {
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
              {room.guests.length == 0 && (
                <Typography variant="h6" component="h2">
                  No Guests
                </Typography>
              )}
              {room.guests.length > 0 && (
                <Typography
                  variant="h6"
                  component="h2"
                  className={
                    room.guests.length == 0 ? classes.hide : classes.show
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
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={2} align="center">
              <Button
                color="primary"
                variant="contained"
                to="/create"
                component={Link}
              >
                Create a Room
              </Button>
            </Grid>

            <Grid item xs={2} align="center">
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
      </Grid>
    );
  }
};
export default DashboardPage;
