import React, {Component} from 'react';
import * as firebase  from 'firebase';
import {connect} from 'react-redux';
import {Card, Image, Feed, Icon, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import {deleteUserUpload} from  '../../actions/actions.user.delete';
import {getUserUploads} from '../../actions/actions.uploads';

import FavoriteToggle from '../toggle/toggle.favorite';
import LikeToggle from '../toggle/toggle.like';
import VideoPlayer from "../video/video.player";

var moment = require("moment");
moment().format();

class FeedCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publisher: null
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.getPublisherInfo();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getPublisherInfo() {
    const {upload} = this.props;
    firebase.database().ref(`users/${upload.publisher.id}/profile`).once('value', snap => {
      if(this.mounted) {
        this.setState({publisher: snap.val()})
      }
    })
  }

  removeUpload = () => {
    const { auth, user, upload } = this.props;
    if(confirm(`Are you sure you want to remove ${upload.title}?`)) {
      this.props.deleteUserUpload(auth.currentUser.uid, upload.id);
      // TODO: pass down page and date to render same page
      this.props.getUserUploads(user.data.id, Date.now(), 1, 'uploads');
    }
  };

  renderCardContent = (upload, hoverCard, hoverLink, hoverUser) => {
    const {auth, user, activeMenu} = this.props;

    if(_.isEmpty(auth.currentUser)) {return null}
    return (
      <Card.Content style={topContentHover}>
        <Feed>
          <Feed.Event>
            <Feed.Label image={this.state.publisher && this.state.publisher.avatar} />
            <Feed.Content>
              <Feed.Summary>
                <Feed.User
                  as={Link} to={`/profile/${upload.publisher.id}`}
                  style={hoverUser?white:lightBlue}>{upload.publisher.username}</Feed.User>
                <Feed.Date style={white}>
                  {moment(upload.created_at).format("MMM Do YY") === moment(Date.now()).format("MMM Do YY") ?
                    moment(upload.created_at).fromNow() : moment(upload.created_at).format("MMM Do YY, h:mm:ss a")}
                  </Feed.Date>
              </Feed.Summary>
              <Feed.Extra name='caption'
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
                  {user.data && (auth.currentUser.uid === upload.publisher.id) && (auth.currentUser.uid === user.data.id) && (activeMenu === 'uploads') &&
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
        <Card fluid name='card'>
          {this.renderCardContent(upload, hoverCard, hoverLink, hoverUser)}
          <VideoPlayer source={upload} options={upload.options}/>
        </Card>
      );
    } else if (upload.type === 'image') {
      return(
        <Card fluid name='card'>
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
  {deleteUserUpload, getUserUploads})(FeedCard);


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
  cursor: 'pointer',
  margin: '0'
};