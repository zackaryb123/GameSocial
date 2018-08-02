import React, { Component } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Icon} from 'semantic-ui-react';

import {removeFavorite, addFavorite,getInitFavoriteState, getFavoritesOnce} from "../../actions/actions.favorites";
import {removeTrackedFavorite, addTrackedFavorite, getTrackedFavoritesOnce} from "../../actions/actions.track.favorites";

class FavoriteToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Favorite Toggle',
      isFavorite: null,
      renderFavorites: null
    }
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');

    // TODO: Find a better way to initialize favorites
    const {upload, auth, getInitFavoriteState} = this.props;
    getInitFavoriteState(auth.currentUser.uid, upload.id)
      .then(exist => this.setState({isFavorite: exist, renderFavorites: true})) ;
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);

    const {upload, favorites} = this.props;
    // On like props received set the liked boolean
    if (nextProps.favorites.data !== favorites.data){
      this.setState({isFavorite: nextProps.favorites.data && (upload.id in nextProps.favorites.data),
        renderFavorites: true})
    } else {
      console.log('Component Up to date!')}
  }


  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);

    if(nextState.renderFavorites){return true}
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    console.log(this.state.name, "Did Update", prevProps, prevState);
    if(this.state.renderFavorites){
      this.setState({renderFavorites: false})
    } else { alert('missing toggle fav handler') }
  }

  unFavorite = () =>{
    console.log('click unfavorite success');
    const {auth, upload} = this.props;
    this.props.removeFavorite(auth.currentUser.uid, upload.id);
    this.props.getFavoritesOnce(auth.currentUser.uid);
    // this.props.removeTrackedFavorite(auth.currentUser.uid, upload);
    // this.props.getTrackedFavoritesOnce(auth.currentUser.uid);
  };

  doFavorite = () => {
    console.log('click favorite success');
    const {auth, upload} = this.props;
    this.props.addFavorite(auth.currentUser.uid, upload);
    this.props.getFavoritesOnce(auth.currentUser.uid);
    // this.props.addTrackedFavorite(auth.currentUser.uid, upload);
    // this.props.getTrackedFavoritesOnce(auth.currentUser.uid);
  };

  render() {
    const {auth} = this.props;
    const {isFavorite} = this.state;
    return (
      auth.currentUser &&
      <span>
        <Icon inverted name={isFavorite ? 'star' : 'star outline'} onClick={isFavorite ? this.unFavorite : this.doFavorite}/>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  favorites: state.favorites
});

export default connect(mapStateToProps,
  {getFavoritesOnce, removeFavorite, addFavorite, getInitFavoriteState,
  removeTrackedFavorite, addTrackedFavorite, getTrackedFavoritesOnce})
(FavoriteToggle);

const cWhite = {
  color: 'white'
};