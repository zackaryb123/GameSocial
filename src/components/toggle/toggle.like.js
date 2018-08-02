import React, { Component } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Icon} from 'semantic-ui-react';
import {removeLike, addLike, getInitLikeState, getLikesOnce} from "../../actions/actions.likes";
import {upload} from "../../actions/actions.modals";

class LikeToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Like Toggle',
      isLiked: null,
      count: null,
      renderLikes: null
    }
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    console.log(this.state.name, 'Did Mount ');

    // TODO: Find a better way to initialize likes
    const {upload, auth, getInitLikeState} = this.props;
    getInitLikeState(auth.currentUser.uid, upload.id)
      .then(exist =>
        this.setState({count: _.size(upload.likes), isLiked: exist, renderLikes: true}));
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);

    const {upload, likes} = this.props;
    // Only handles state change by check renderLikes (renderLikes set to false when props updated on click)
    if (this.state.renderLikes && (nextProps.likes.data !== likes.data)){
      this.setState({isLiked: nextProps.likes.data && (upload.id in nextProps.likes.data), renderLikes: true})
    }else{console.log('Component Up to date!')}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);

    switch (true) {
      case (nextState.renderLikes):
        return true;
      case (nextState.count !== this.state.count):
        return true;
      default:
        return false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    console.log(this.state.name, "Did Update", prevProps, prevState);
    const {renderLikes, isLiked} = this.state;

    switch(true) {
      case (renderLikes && isLiked):
        return this.setState({renderLikes: false, count: _.size(upload.likes) + 1});
      case(renderLikes && !isLiked):
        return this.setState({renderLikes: false, count: _.size(upload.likes)});
      default:
        return ('Last Render')
    }
  }

  unLike = () =>{
    console.log('click unfavorite success');
    const {auth, upload} = this.props;
    this.props.removeLike(auth.currentUser.uid, upload.id, upload.publisher.id);
    this.props.getLikesOnce(auth.currentUser.uid);
    // Set renderLikes to false to prevent prop updates from causing re-renders
    this.setState({count: this.state.count - 1, isLiked: false, renderLikes: false})
  };

  doLike = () => {
    console.log('click favorite success');
    const {auth, upload} = this.props;
    this.props.addLike(auth.currentUser.uid, upload.id, upload.publisher.id);
    this.props.getLikesOnce(auth.currentUser.uid);
    // Set renderLikes to false to prevent prop updates from causing re-renders
    this.setState({count: this.state.count + 1, isLiked: true, renderLikes: false})
  };

  render() {
    const {auth} = this.props;
    const {isLiked, count} = this.state;
    return (
      auth.currentUser &&
      <span>
        <Icon inverted name={isLiked ? 'heart' : 'heart outline'} onClick={isLiked ? this.unLike : this.doLike}/>
        <span style={cWhite}>{count}</span>
      </span>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth,
  likes: state.likes
});

export default connect(mapStateToProps,
  {getLikesOnce, removeLike, addLike, getInitLikeState})
(LikeToggle);

const cWhite = {
  color: 'white'
};