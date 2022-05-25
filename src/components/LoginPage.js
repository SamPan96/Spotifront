import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";

import baseUrl from "../global";
import App from "./../App"
import DashboardPage from "./DashboardPage";

const LoginPage = () => {
  const [name, setname] = useState("")
  const [logged, setlogged] = useState(false)

  function handleNameChanged(e) {
    setname(e.target.value)
  }

  function handleLoginButtonPressed(){
    const requestOptions = {
      method: "POST",
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name
      }),
    };
    fetch(baseUrl+"/api/create-person", requestOptions)
    .then(
      (response)=>response.json()
    ).then((data) =>{
      setname(data.name);
      setlogged(true);
    })
    .catch((error)=>console.log(error))
  }

  if (logged == true) {
    return <DashboardPage name={name}/>
}
  else{
    return (
      <Grid container spacing={1}>
        {/* First Grid Element: Title */}

        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Welcome to the Music Controller!
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography component="subtitle1" variant="subtitle1">
            Here you can create music rooms, or join rooms created by your
            friends!
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography component="subtitle2" variant="subtitle2">
            But first i need to know you better!
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              onChange={handleNameChanged}
              inputProps={{
                style: { textAlign: "center" },
              }}
            />

            <FormHelperText>
              <div align="center"> Enter your name:</div>
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleLoginButtonPressed}
          >
            Let's listen to some music!
          </Button>
        </Grid>
      </Grid>
    );
  }
}
export default LoginPage;


