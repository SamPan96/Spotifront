import { createTheme, MuiThemeProvider } from '@mui/material/core/styles';
import React, { Component, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import baseUrl from "../global";
import CreateRoomPage from "./CreateRoomPage";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import Room from "./Room";
import RoomJoinPage from "./RoomJoinPage";

const HomePage = () => {
  const theme = createTheme({
    palette: {
      secondary: {
        main: '#3e4fe3'
      },
      primary:{
        main:'#cae33e'
      }
    }
  });

  const[name,setName] = useState("");
  const[isLogged, setisLogged] = useState("false")
  function checkLogin() {
    
    let requestOptions = {
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json"},
      body: {},
    };
    fetch(baseUrl+"/api/check-login", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          
          setisLogged("true")
          response.json().then((data)=>setName(data.name))
        } else {
          
          setisLogged("false")
        }
      });
  }
  useEffect(() => {
    checkLogin();
    return () => {
    }
  }, [])

  
  
  if(isLogged === "true"){
    return (
      <MuiThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route exact path='/room/:roomCode' element={<Room/> } />
        </Routes>
      </Router>
      </MuiThemeProvider> )
  }

  else{
    return (
      <MuiThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route exact path='/room/:roomCode' element={<Room/> } />
        </Routes>
      </Router>
      </MuiThemeProvider> )
;
  }
}
 
export default HomePage;