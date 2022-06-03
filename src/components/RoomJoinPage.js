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
      headers: { "Content-Type": "application/json" },
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
      .catch((error)=>
    }
  }

  function roomButtonPressed() {
    let requestOptions = {
      method: "POST",
      credentials: 'include',
      crossorigin: 'true',
      headers: { "Content-Type": "application/json" },
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
    setRoomCode(e.target.value);
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
          <Grid container spacing={1}>
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
              <Button
                variant="contained"
                color="primary"
                onClick={roomButtonPressed}
              >
                Enter Room
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
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
        </div>
      );
  } 
  else {
    
    return <LoginPage />;
  }
};

export default RoomJoinPage;
