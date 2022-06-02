import axios from "axios";
import Randomstring from "randomstring";
import React, { Component, useEffect, useState } from "react";
import { ReactSession } from 'react-client-session';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Cookies from 'js-cookie'

import CreateRoomPage from "./components/CreateRoomPage";
import DashboardPage from "./components/DashboardPage";
import LoginPage from "./components/LoginPage";
import Room from "./components/Room";
import RoomJoinPage from "./components/RoomJoinPage";
import baseUrl from "./global";

const App = () => {

  const[name,setName] = useState("");
  const[isLogged, setisLogged] = useState("false")
  function checkLogin() {
    let requestOptions = {
      method: "POST",
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json"},
      body: {},
    };
    fetch(baseUrl+"/api/check-login", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          console.log('200')
          setisLogged("true")
          response.json().then((data)=>setName(data.name))
        } else {
          Cookies.set('sessionid', response.headers['sessionid'])
          console.log(response.status)
          setisLogged("false")
          console.log('logged returned false')
        }
      })
  }
  useEffect(() => {
    checkLogin();
    return () => {
    }
  }, [])

  console.log('started render')
  console.log(isLogged)
  if(isLogged === "true"){
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<DashboardPage name={name} />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route exact path="/room/:roomCode" element={<Room />} /> 
        </Routes>
      </Router>
    )
  }

  else{
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route exact path='/room/:roomCode' element={<Room/> } />
        </Routes>
      </Router>
    );

  }
}
 
export default App;