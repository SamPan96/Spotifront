import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from 'react';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import baseUrl from "../global";
import LoginPage from "./LoginPage";
import Room from './Room';
import Footer from "./Footer";
const RoomJoinPage = () => {
  const [isLogged, setIsLogged] = useState("false");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 


  

  function checkLogin() {
    let requestOptions = {
      method: "POST",
      credentials: 'include',
      crossorigin: 'true',
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
      body: {},
    };
    if (isLogged==="true") {
      return;
    } else {
      fetch(baseUrl+"/api/check-login", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          setIsLogged("true");
        } else {
          setIsLogged("false");
        }
      })
    }
  }

  function roomButtonPressed() {
    let requestOptions = {
      method: "POST",
      credentials: 'include',
      crossorigin: 'true',
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
      body: JSON.stringify({
        code: roomCode,
      }),
    };
    fetch(baseUrl+"/api/join-room", requestOptions)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw data;
          });
        }
        return response.json();
      })
      .then((data) => {
        
        navigate("/room/"+roomCode)
        
      })
      .catch((e) => {
        
        
        setError(e.message);
      });
  }

  function handleTextFieldChange(e) {
    setRoomCode(e.target.value.toUppercase());
    setError("")
  }

  useEffect(() => {
    checkLogin();
    return () => {
      
    };
  }, []);

  
  
  if (isLogged === "true") {
      
      return (
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <Typography variant="h4" component="h4">
                Join a Room
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <TextField
                error={error}
                label="Code"
                placeholder="Enter a Room Code"
                value={roomCode}
                helperText={error}
                variant="outlined"
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid item xs={12} align="center">
            <Grid
            container
            direction="row"
            spacing={3}
            justifyContent="space-between"
            alignItems="center"
          >

            <Grid item xs={6.2} align="end">
              <Button
                variant="contained"
                color="primary"
                onClick={roomButtonPressed}
              >
                Enter Room
              </Button>
            </Grid>
            <Grid item xs={5.8} align="start">
              <Button
                variant="contained"
                color="secondary"
                to="/"
                component={Link}
              >
                Back
              </Button>
            </Grid>
            </Grid>
            </Grid>
            <Grid item xs={12} align="center">
              <Footer></Footer>
              </Grid>
          </Grid>
        </div>
      );
  } 
  else {
    
    return <LoginPage />;
  }
};

export default RoomJoinPage;
