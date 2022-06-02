import CheckIcon from "@mui/icons-material/Check";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Card, Grid, IconButton, LinearProgress, Typography } from "@mui/material";
import React, { Component, useState } from "react";

import baseUrl from "../global";

const MusicPlayer = (props) => {
  // const [hasSkipped, sethasSkipped] = useState(false)

  
  function handleSkip() {
    let endpoint = "/spotify/skip";
    const requestOptions = {
      method: "POST",
      credentials:"include",
      crossDomain: "true",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_code: props.room_code,
      }),
    };
    fetch(baseUrl+endpoint, requestOptions).then((response)=>{
      if(response.ok){
        // sethasSkipped(true)
      }
    })
  }

  function handlePlayPause() {
    let endpoint = props.song.is_playing ? "/spotify/pause" : "/spotify/play";
    const requestOptions = {
      method: "POST",
      credentials: 'include',
      crossorigin: 'true',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_code: props.room_code,
      }),
    };
    fetch(baseUrl+endpoint, requestOptions).then((response) => {
    });
  }

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={props.song.image_url} height="100%" width="100%" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {props.song.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.song.artist}
          </Typography>
          <div>
            <IconButton onClick={handlePlayPause}>
              {props.song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
<IconButton>
      {props.song.votes} / {props.song.votes_required}
      <SkipNextIcon onClick={handleSkip} />
    </IconButton>
     

{/* { hasSkipped === true &&   <IconButton>
      {props.song.votes} / {props.song.votes_required}
      <CheckIcon onClick={handleDontSkip} />
    </IconButton>


} */}
</div>
        </Grid>
      </Grid>
      <LinearProgress
        variant="determinate"
        value={(props.song.time / props.song.duration) * 100}
      />
    </Card>
  );
};

export default MusicPlayer;
