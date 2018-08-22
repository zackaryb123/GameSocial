import React, { Component } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Icon} from 'semantic-ui-react';
import {removeLike, addLike, getInitLikeState, getLikesOnce} from "../../trash/actions.likes";

class LikeToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Like Toggle',
      isLiked: null,
      count: null,
      renderLikes: null,
    }
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');
    const {upload, auth, getInitLikeState} = this.props;
    this.mounted = true;
    getInitLikeState(auth.currentUser.uid, upload.id)
      .then(likeList => { if(this.mounted) {this.setState({
        count: _.size(likeList), isLiked: likeList && auth.currentUser.uid in likeList})}
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  unLike = () =>{
    console.log('click unfavorite success');
    const {auth, upload} = this.props;
    const {count} = this.state;
    this.props.removeLike(auth.currentUser.uid, upload.id, upload.publisher.id);
    this.setState({isLiked: false, count: count - 1})
  };

  doLike = () => {
    console.log('click favorite success');
    const {auth, upload} = this.props;
    const {count} = this.state;
    this.props.addLike(auth.currentUser.uid, upload.id, upload.publisher.id);
    this.setState({isLiked: true, count: count + 1})
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
  auth: state.auth
});

export default connect(mapStateToProps,
  {getLikesOnce, removeLike, addLike, getInitLikeState})
(LikeToggle);

const cWhite = {
  color: 'white'
};