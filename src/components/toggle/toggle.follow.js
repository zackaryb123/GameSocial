import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Image, Card, Button} from 'semantic-ui-react';

import {addFollowers, removeFollowers} from "../../actions/actions.followers";
import {addFollowing,removeFollowing, getFollowingOnce} from "../../actions/actions.following";
import {getUserOnce} from "../../actions/actions.user";

class FollowToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: null,
      following: null
    }
  }

  unFollow = () => {
    console.log('click unfollow success');
    const {auth, publisher, user} = this.props;
    this.props.removeFollowers(auth.currentUser.uid, publisher.id);
    this.props.removeFollowing(auth.currentUser.uid, publisher.id);
    this.props.getFollowingOnce(auth.currentUser.uid);

    if(user.data){
      this.props.getUserOnce(this.props.user.data.id);
    }
  };

  Follow = () => {
    console.log('click follow success');
    const {auth, publisher, user} = this.props;
    this.props.addFollowers(auth.currentUser, publisher.id);
    this.props.addFollowing(auth.currentUser.uid, publisher);
    this.props.getFollowingOnce(auth.currentUser.uid);

    if(user.data){
      this.props.getUserOnce(this.props.user.data.id);
    }
  };

  render() {
    const {publisher, auth, following} = this.props;
    return (
      <div>
        {
          // If followers is updating return loading button
          // TODO: Change loading to state to render individual buttons
          following.loading ? (
            <Button loading/>
          ):(
            <div>
              {
                // if unAuthorized (not logged in) don't show follow or unfollow button
                (!_.isEmpty(auth.currentUser) && (publisher.id !== this.props.auth.currentUser.uid)) &&
                <div>
                  {
                    // Check auth user's following list to render unfollow or follow button
                    following.data[publisher.id] ? (
                      <Button
                        onClick={this.unFollow}
                        color='green'>Unfollow</Button>
                    ):(
                      <Button
                        onClick={this.Follow}
                        basic color='green'>Follow</Button>
                    )
                  }
                </div>
              }
            </div>
          )
        }
      </div>
    );
  }
}


const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  followers: state.followers,
  following: state.following
});

export default connect(mapStateToProps,
  { addFollowing, addFollowers,
    removeFollowing, removeFollowers, getUserOnce, getFollowingOnce})
(FollowToggle);

