import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Player, BigPlayButton} from 'video-react';
import {Card, Image, Feed, Icon, Reveal} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import FavoriteToggle from '../toggle/toggle.favorite';
import LikeToggle from '../toggle/toggle.like';

class FeedCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  hover = () => this.setState({hover: true});
  unhover = () => this.setState({hover: false});

  renderCardContent = (upload, hover, state) => {
    return (
      <Card.Content style={hover ? topContentHover : {display: 'none'}}>
        <Feed>
          <Feed.Event>
            <Feed.Label image='https://res.cloudinary.com/game-social/image/upload/v1529600986/Avatars/do3vsmak5q0uvsotseed.png' />
            <Feed.Content>
              <Feed.Summary>
                <Feed.User as={Link} to='/' style={cWhite}>{upload.publisher.username}</Feed.User>
                <Feed.Date style={cWhite}>{upload.created_at}</Feed.Date>
              </Feed.Summary>
              <Feed.Extra style={cWhite} text>{upload.caption}</Feed.Extra>
              <Feed.Meta style={metaContent}>
                <Feed.Like>
                  <Icon inverted name='eye' />
                  <span style={cWhite}>{_.size(upload.views)}</span>
                </Feed.Like>
                <Feed.Like>
                  <LikeToggle upload={upload}/>
                </Feed.Like>
                <Feed.Like>
                  <Icon inverted name='star'/>
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Card.Content>
    );
  };


  render() {
    const {upload} = this.props;
    const {hover, liked} = this.state;

    if(upload.type === 'video'){
      return (
        <Card fluid onMouseEnter={this.hover} onMouseLeave={this.unhover}
              //as={Link} to={`/view/${upload.publisher.id}/${upload.type}/${upload.id}`}
          >
          {this.renderCardContent(upload, hover, liked)}
          <Player className="card-img-top" alt="upload" aspectRatio='16:9' controls={false} playsInline={true} muted={true} autoPlay={false} loop={false}>
            <source src={upload.url}/>
            <BigPlayButton position="center" />
          </Player>
        </Card>
      );
    } else if (upload.type === 'image') {
      return(
        <Card fluid onMouseEnter={this.hover} onMouseLeave={this.unhover}
              //as={Link} to={`/view/${upload.publisher.id}/${upload.type}/${upload.id}`}
        >
          {this.renderCardContent(upload, hover, liked)}
          <Image alt="upload" src={upload.url}/>
        </Card>
        );
    } else {
      return(
      <Card fluid onMouseEnter={this.hover} onMouseLeave={this.unhover} as={Link} to={`/view/${upload.publisher.id}/${upload.type}/${upload.id}`}>
        <Header>Upload Type Not Supported</Header>
      </Card>
      );
    }
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,
  {})(FeedCard);


const topContentHover = {
  marginBottom: '-5.1rem',
  zIndex: '1',
  backgroundColor: 'rgba(0,0,0,.85)',
  transition: 'all 1s ease',
  paddingBottom: '0'
};

const metaContent = {
  position: 'absolute',
  right: '0',
  top: '0',
  marginRight: '1rem'
};

const cWhite = {
  color: 'white'
};