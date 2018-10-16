import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Icon, Button, Header } from "semantic-ui-react";

import {addFollowers, removeFollowers} from "../../actions/actions.followers";
import {addFollowing, removeFollowing, getFollowingOnce, getInitFollowingState} from "../../actions/actions.following";
import {getUserOnce} from "../../actions/actions.user";

class FollowToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Follow Toggle',
      renderFollow: null
    }
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');
    this.mounted = true;
    const {publisher, auth, getInitFollowingState} = this.props;
    getInitFollowingState(auth.currentUser.uid, publisher.id)
      .then(exist => {if(this.mounted) {this.setState({isFollowed: exist})}})

    // this.props.getFollowingOnce(this.props.auth.currentUser.uid);
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {publisher, following} = this.props;
    if (nextProps.following.data !== following.data){
      this.setState({ isFollowed: nextProps.following.data && (publisher.id in nextProps.following.data)})
    }else{console.log('Component Up to date!')}
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  unFollow = () => {
    console.log('click unfollow success');
    const {auth, publisher, user} = this.props;
    this.props.removeFollowers(auth.currentUser.uid, publisher.id);
    this.props.removeFollowing(auth.currentUser.uid, publisher.id);
    this.props.getFollowingOnce(auth.currentUser.uid);

    //For Profile page
    if(user.data){
      this.props.getUserOnce(this.props.user.data.id);
    }
  };

  doFollow = () => {
    console.log('click follow success');
    const {auth, publisher, user} = this.props;
    this.props.addFollowers(auth.currentUser, publisher.id);
    this.props.addFollowing(auth.currentUser.uid, publisher);
    this.props.getFollowingOnce(auth.currentUser.uid);
    // For Profile page
    if(user.data){
      this.props.getUserOnce(this.props.user.data.id);
    }
  };

  render() {
    const {auth, publisher} = this.props;
    const {isFollowed} = this.state;
    return (
      auth.currentUser !== publisher.id &&
      <Button style={followBtn} onClick={isFollowed ? this.unFollow : this.doFollow}>
        {isFollowed && <Icon style={{color: '#4183c4'}} name='check'/>}
        <Icon style={{color: '#4183c4'}} name='user'/>
        <Header style={{margin: '0', color: '#4183c4'}} as='h6'>{isFollowed?'Following':'Follow'}</Header>
      </Button>
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
  { addFollowing, addFollowers, getInitFollowingState,
    removeFollowing, removeFollowers, getUserOnce, getFollowingOnce})
(FollowToggle);

const followBtn = {
  backgroundColor: 'inherit',
  position: 'absolute',
  right: '0',
  top: '0',
  bottom: '0',
  padding: '.5rem .5rem',
  margin: '0',
  outline: 'none'
};
