import React, { Component } from "react";
import * as firebase from 'firebase';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Image, Card, Loader, Dimmer } from "semantic-ui-react";

import FollowToggle from "../toggle/toggle.following";

import { addFollowers, removeFollowers } from "../../actions/actions.followers";
import { addFollowing, removeFollowing } from "../../actions/actions.following";

class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      following: null
    };
  }

  componentDidMount(){
    const {publisher} = this.props;
    firebase.database().ref(`users/${publisher.id}/profile`).once('value', snap => {
      const publisher = snap.val();
      this.setState({avatar: publisher.avatar})
    })
  }

  render() {
    const {publisher, auth } = this.props;
    const {avatar} = this.state;
    return (
      <Card>
        <Card.Content>
          {avatar ? <Image
            style={{ borderRadius: ".25rem" }}
            size="mini"
            src={avatar}/>
          : null}
          <Card.Header style={cssHeader}>
            <Link to={`/profile/${publisher.id}`}>{publisher.username}</Link>
          </Card.Header>
          {auth.currentUser.uid !== publisher.id && <FollowToggle publisher={publisher} />}
        </Card.Content>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    addFollowing,
    addFollowers,
    removeFollowing,
    removeFollowers
  }
)(UserCard);


const cssHeader = {
  display: 'inline-block',
  marginLeft: '.5rem'
};

const followBtn = {
  backgroundColor: 'white',
  position: 'absolute',
  right: '0',
  top: '0',
  bottom: '0',
  padding: '.5rem .5rem',
  margin: '0',
  border: 'none'
};