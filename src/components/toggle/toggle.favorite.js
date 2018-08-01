import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Image, Card, Button} from 'semantic-ui-react';

import {removeFavorite, addFavorite, getFavoritesOnce} from "../../actions/actions.favorite";
import {removeTrackedFavorite, addTrackedFavorite, getTrackedFavoritesOnce} from "../../actions/actions.track.favorites";

//TODO: pass uploadId from this parent
class FavoriteToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favoriteList: null,
      isFavorite: null
    }
  }

  unFavorite = () =>{
    console.log('click unfavorite success');
    const {auth, upload} = this.props;
    this.props.removeFavorite(auth.currentUser.uid, upload);
    this.props.removeTrackedFavorite(auth.currentUser.uid, upload);

    this.props.getFavoritesOnce(auth.currentUser.uid);
    this.props.getTrackedFavoritesOnce(auth.currentUser.uid);
  };

  Favorite = () => {
    console.log('click favorite success');
    const {auth, upload} = this.props;
    this.props.addFavorite(auth.currentUser.uid, upload);
    this.props.addTrackedFavorite(auth.currentUser.uid, upload);

    this.props.getFavoritesOnce(auth.currentUser.uid);
    this.props.getTrackedFavoritesOnce(auth.currentUser.uid);
  };

  render() {
    const {upload, auth, favorites} = this.props;
    return (
      <div>
        {
          // If followers is updating return loading button
          favorites.loading ? (
            <Button loading/>
          ):(
            <div>
              {
                // if unAuthorized (not logged in) don't show follow or unfollow button
                !_.isEmpty(auth.currentUser) &&
                <div>
                  {
                    _.isEmpty(favorites.data) ? (
                      <Button
                        onClick={this.Favorite}
                        basic color='yellow'>Favorite</Button>
                    ):(
                      favorites.data[upload.id] ? (
                        <Button
                          onClick={this.unFavorite}
                          color='yellow'>Unfavorite</Button>
                      ) : (
                        <Button
                          onClick={this.Favorite}
                          basic color='yellow'>Favorite</Button>
                      )
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
  favorites: state.favorites
});

export default connect(mapStateToProps,
  {getFavoritesOnce, removeFavorite, addFavorite,
  removeTrackedFavorite, addTrackedFavorite, getTrackedFavoritesOnce})
(FavoriteToggle);