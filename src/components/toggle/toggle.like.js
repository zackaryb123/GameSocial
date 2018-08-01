import React, { Component } from 'react';
import * as firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Feed, Icon} from 'semantic-ui-react';
import {removeLike, addLike, getLikesOnce} from "../../actions/actions.likes";

//TODO: pass uploadId from this parent
class LikeToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Like Toggle',
      liked: null,
      count: null,
    }
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");

    // Initialize uploads like count
    this.setState({count: _.size(this.props.upload.likes)})
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);

    const {upload, likes} = this.props;
    // On like props received set the liked boolean
    if(nextProps.likes.data !== likes.data)
    {this.setState({liked: upload.id in nextProps.likes.data})}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);
    if(nextProps.likes.data !== this.props.likes.data) {return true}
    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    // console.log(this.state.name ,"Will Update", nextProps, nextState);

  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    console.log(this.state.name, "Did Update", prevProps, prevState)
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
  }

  unLike = () =>{
    console.log('click unfavorite success');
    const {auth, upload} = this.props;
    this.props.removeLike(auth.currentUser.uid, upload.id, upload.publisher.id);
    this.props.getLikesOnce(auth.currentUser.uid);

    this.setState({count: this.state.count - 1})
  };

  like = () => {
    console.log('click favorite success');
    const {auth, upload} = this.props;
    this.props.addLike(auth.currentUser.uid, upload.id, upload.publisher.id);
    this.props.getLikesOnce(auth.currentUser.uid);

    this.setState({count: this.state.count + 1})
  };

  render() {
    const {auth} = this.props;
    const {liked, count} = this.state;
    return (
      auth.currentUser &&
      <span>
        <Icon inverted name={liked ? 'heart' : 'heart outline'} onClick={liked ? this.unLike : this.like}/>
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
  {getLikesOnce, removeLike, addLike})
(LikeToggle);

const cWhite = {
  color: 'white'
};