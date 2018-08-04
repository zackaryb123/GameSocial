import React, { Component } from 'react';
import { Player, ControlBar, ReplayControl, CurrentTimeDisplay, TimeDivider, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';
import {Container } from 'semantic-ui-react';

import "../../ui/assets/css/video-react.css";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableContralBar: false
    };
    console.log('VideoPlayer');
  }
  render() {

    return (
      <section id='video-player'>
        <Container>
          <Player aspectRatio='16:9' controls={false} playsInline={true} muted={true} autoPlay={this.props.options.autoPlay} loop={this.props.options.looping_enabled}>
            <source src={this.props.source.url} />
            <ControlBar>
              <ReplayControl seconds={10} order={1.1} />
              <CurrentTimeDisplay order={4.1} />
              <TimeDivider order={4.2} />
              <PlaybackRateMenuButton
                rates={[5, 2, 1, 0.5, 0.1]}
                order={7.1} />
              <VolumeMenuButton />
            </ControlBar>
          </Player>
        </Container>
      </section>
    )
  }
}

export default VideoPlayer;