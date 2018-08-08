import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Icon, Button } from "semantic-ui-react";

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

    // TODO: Find a better way to initialize favorites
    const {publisher, auth, getInitFollowingState} = this.props;
    getInitFollowingState(auth.currentUser.uid, publisher.id)
      .then(exist => this.setState({isFollowed: exist, renderFollow: true}));
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);

    const {publisher, following} = this.props;
    if (nextProps.following.data !== following.data){
      this.setState({
        isFollowed: nextProps.following.data && (publisher.id in nextProps.following.data),
        renderFollow: true})
    } else {
      console.log('Component Up to date!')}
  }


  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);

    if(nextState.renderFollow){return true}
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    console.log(this.state.name, "Did Update", prevProps, prevState);
    if(this.state.renderFollow){
      this.setState({renderFollow: false})
    } else { alert('missing toggle fav handler') }
  }




  unFollow = () => {
    console.log('click unfollow success');
    const {auth, publisher, user} = this.props;
    this.props.removeFollowers(auth.currentUser.uid, publisher.id);
    this.props.removeFollowing(auth.currentUser.uid, publisher.id);
    this.props.getFollowingOnce(auth.currentUser.uid);
    // For Profile page
    // if(user.data){
    //   this.props.getUserOnce(this.props.user.data.id);
    // }
  };

  doFollow = () => {
    console.log('click follow success');
    const {auth, publisher, user} = this.props;
    this.props.addFollowers(auth.currentUser, publisher.id);
    this.props.addFollowing(auth.currentUser.uid, publisher);
    this.props.getFollowingOnce(auth.currentUser.uid);
    // For Profile page
    // if(user.data){
    //   this.props.getUserOnce(this.props.user.data.id);
    // }
  };

  render() {
    const {auth, publisher} = this.props;
    const {isFollowed} = this.state;
    return (
      auth.currentUser !== publisher.id &&
      <Button onClick={isFollowed ? this.unFollow : this.doFollow}>
        <Icon name={isFollowed ? 'check' : null}/>
        <Icon name='user'/>
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

