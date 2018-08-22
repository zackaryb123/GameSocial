import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, Image, Feed, Icon, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import FavoriteToggle from '../toggle/toggle.favorite';
import LikeToggle from '../toggle/toggle.like';
import VideoPlayer from "../video/video.player";

class FeedCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  removeUpload = () => {
    const { auth, user, upload, activePlaylist } = this.props;
    // this.props.removeFromPlaylist(auth.currentUser.uid, upload.id, activePlaylist);
    // this.props.getPlaylistOnce(user.data.id);
  };

  hoverCard = (e) => this.setState({hoverCard: true});
  unhoverCard = (e) => this.setState({hoverCard: false});

  hoverLink = (e) => this.setState({hoverLink: true});
  unhoverLink = (e) => this.setState({hoverLink: false});

  hoverUser = (e) => this.setState({hoverUser: true});
  unhoverUser = (e) => this.setState({hoverUser: false});

  renderCardContent = (upload, hoverCard, hoverLink, hoverUser) => {
    const {auth, user} = this.props;
    return (
      <Card.Content style={topContentHover}>
        {/*hoverCard ? topContentHover : {display: 'none'}}>*/}
        <Feed>
          <Feed.Event>
            <Feed.Label image='https://res.cloudinary.com/game-social/image/upload/v1529600986/Avatars/do3vsmak5q0uvsotseed.png' />
            <Feed.Content>
              <Feed.Summary>
                <Feed.User
                  // onMouseEnter={this.hoverUser} onMouseLeave={this.unhoverUser}
                  as={Link} to={`/profile/${upload.publisher.id}`}
                  style={hoverUser?white:lightBlue}>{upload.publisher.username}</Feed.User>
                <Feed.Date style={white}>{upload.created_at}</Feed.Date>
              </Feed.Summary>
              <Feed.Extra name='caption'
                // onMouseEnter={this.hoverLink} onMouseLeave={this.unhoverLink}
                as={Link} to={`/upload/${upload.publisher.id}/uploads/${upload.id}`}
                style={hoverLink?white:lightBlue} text>{upload.caption}</Feed.Extra>
              <Feed.Meta style={metaContent}>
                <Feed.Like>
                  <Icon inverted name={'eye'}/>
                  <span style={white}>{_.size(upload.views)}</span>
                </Feed.Like>
                <Feed.Like>
                  <LikeToggle upload={upload}/>
                </Feed.Like>
                <Feed.Like>
                  <FavoriteToggle upload={upload}/>
                </Feed.Like>
                <Feed.Like>
                  {user.data && (auth.currentUser.uid === upload.publisher.id) && (auth.currentUser.uid === user.data.id) &&
                    <Icon inverted size='large' style={cssCloseIcon} corner onClick={this.removeUpload} name={"remove circle"}/>}
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
    const {hoverCard, hoverLink, hoverUser} = this.state;

    if(upload.type === 'video'){
      return (
        <Card fluid name='card'
              // onMouseEnter={this.hoverCard} onMouseLeave={this.unhoverCard}
        >
          {this.renderCardContent(upload, hoverCard, hoverLink, hoverUser)}
          <VideoPlayer source={upload} options={upload.options}/>
        </Card>
      );
    } else if (upload.type === 'image') {
      return(
        <Card fluid name='card'
              // onMouseEnter={this.hoverCard} onMouseLeave={this.unhoverCard}
        >
          {this.renderCardContent(upload, hoverCard, hoverLink, hoverUser)}
          <Image alt="upload" src={upload.url}/>
        </Card>
        );
    } else {
      return(
      <Card fluid>
        <Header>Upload Type Not Supported</Header>
      </Card>
      );
    }
  };
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

export default connect(mapStateToProps,
  {})(FeedCard);


const topContentHover = {
  // display: 'block',
  // position: 'absolute',
  // zIndex: '1',
  width: '100%',
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

const white = {
  color: 'white'
};

const lightBlue = {
  color: '#1e70bf'
};

const cssCloseIcon = {
  // position: 'absolute',
  top: '0',
  right: '0',
  // backgroundColor: 'white',
  cursor: 'pointer',
  margin: '0'
};