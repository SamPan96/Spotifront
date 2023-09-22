import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, Card, CardContent, Divider, Grid, IconButton, List, ListItem, TextField, Typography } from "@mui/material";
import React, { Component } from "react";
import { useState } from "react";

import baseUrl from "../global";

const SearchBar = (props) => {
  const [retrieved, setretrieved] = useState([]);
  const [added, setadded] = useState([]);
  const [loaded, setloaded] = useState(5);
  let cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    // height: 200,
    // width: 500,
  };

  function HandleLoadMore() {
    if (loaded + 5 < retrieved.length - 1) {
      
      setloaded(loaded + 5);
    } else {
      setloaded(retrieved.length);
    }
    
  }

  function handleAdd(uri) {
    const requestOptions = {
      method: "POST",
      credentials: "same-origin",
      crossDomain: "true",
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
      body: JSON.stringify({
        room_code: props.room_code,
        uri: uri,
      }),
    };
    fetch(baseUrl + "/spotify/add", requestOptions).then((response) => {
      if (response.ok) {
        setadded(added.concat([uri]));
      }
    });
  }

  function handleRemove(uri) {
    setadded(
      added.filter(function (value) {
        return value != uri;
      })
    );

    // NO SPOTIFY API ENDPOINT YET :(
  }

  function handleQuery(e) {
    if (e.target.value === "") {
      setretrieved([]);
      setloaded(5);
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json","uid":document.getElementById("uid")?document.getElementById("uid"):"" },
      body: JSON.stringify({
        room_code: props.room_code,
        query: e.target.value,
      }),
    };
    fetch(baseUrl + "/spotify/search", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setretrieved(data["songs"]);
      });
  }

  return (
    <div>
      <Box m={3} pt={0}>
        <TextField
          onChange={handleQuery}
          id="filled-search"
          label="Search For Songs/Artists"
          type="search"
          variant="filled"
        />

        {retrieved.length != 0 &&
          retrieved.slice(0, loaded).map((value, key) => {
            return (
              <Card variant="outlined" style={cardStyle}>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item align="center" xs={4}>
                      <img src={value["picture"]} height="50%" width="100%" />
                    </Grid>
                    <Grid item align="center" xs={6}>
                      <Typography component="h6" variant="h6">
                        {value["name"]}
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle1">
                        {value["artist"]}
                      </Typography>
                    </Grid>

                    <Grid item align="center" xs={2}>
                      <IconButton
                        onClick={() =>
                          added.includes(value["uri"])
                            ? handleRemove(value["uri"])
                            : handleAdd(value["uri"])
                        }
                      >
                        {!added.includes(value["uri"]) && <AddIcon></AddIcon>}

                        {added.includes(value["uri"]) && (
                          <CheckIcon></CheckIcon>
                        )}
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        {loaded < retrieved.length && (
          <Button
            align="center"
            color="secondary"
            variant="contained"
            onClick={HandleLoadMore}
          >
            Load More
          </Button>
        )}
      </Box>
    </div>
  );
};

export default SearchBar;
