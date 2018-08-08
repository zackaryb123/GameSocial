import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Image, Card, Button } from "semantic-ui-react";

import FollowToggle from "../toggle/toggle.follow";

import { addFollowers, removeFollowers } from "../../actions/actions.followers";
import { addFollowing, removeFollowing } from "../../actions/actions.following";

class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      following: null
    };
  }

  render() {
    const { publisher, auth } = this.props;
    return (
      <Card>
        <Card.Content>
          <Image
            style={{ borderRadius: ".25rem" }}
            floated="right"
            size="mini"
            src="https://res.cloudinary.com/game-social/image/upload/v1529600986/Avatars/do3vsmak5q0uvsotseed.png"
          />
          <Card.Header>
            <Link to={`/profile/${publisher.id}`}>{publisher.username}</Link>
          </Card.Header>
          {auth.currentUser.uid !== publisher.id && (
            <FollowToggle publisher={publisher} />
          )}
        </Card.Content>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,

  following: state.following
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
