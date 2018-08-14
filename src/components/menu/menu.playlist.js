import React, { Component } from 'react'
import * as firebase from 'firebase';
import {connect} from 'react-redux';
import _ from 'lodash';
import { Dropdown, Icon, Input, Menu, Form, Message} from 'semantic-ui-react'
import {createPlaylist, checkPlaylistNameExist, getPlaylistOnce, getPlaylistOptions} from "../../actions/actions.playlist";

class PlaylistMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'playlist menu',
      activeMenu: null,
      playlist: ''
    };
  }

  componentWillMount() {
    // console.log(this.state.name, "Will Mount");
    this.setState({windowWidth: document.body.clientWidth});
  }

  componentDidMount() {
    // console.log(this.state.name,"Did Mount");
    const {auth, getPlaylistOptions} = this.props;
    this.mounted = true;
    let thisComponent = this;

    window.addEventListener("resize", function(event) {
      if(thisComponent.mounted) {
        thisComponent.setState({ windowWidth: document.body.clientWidth })}
    });

    getPlaylistOptions(auth.currentUser.uid).then(playlistList => {
      this.setState({ playlistList: playlistList})
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.playlist.data !== this.props.playlist.data){
      this.setState({playlistList: nextProps.playlist.data})
    }else{console.log(this.state.name,'props up to date')}
  }

  componentWillUnmount(){
    this.mounted = false;
  }


  handleItemClick = (e, { name }) => {
    this.setState({ activePlaylist: name });
    this.props.getActivePlaylist(name);
  };

  handleChange = (e, { name, value}) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { playlist } = this.state;
    const {auth, createPlaylist, checkPlaylistNameExist} = this.props;

    checkPlaylistNameExist(auth.currentUser.uid, playlist).then(exist => {
      if(!exist){
        createPlaylist(auth.currentUser.uid, playlist);
        this.props.getPlaylistOnce(auth.currentUser.uid);
      } else {
        //TODO: Open feedback modal with message
        alert('Playlist already exist!');
      }
    })
  };

  renderPlaylistMenuItems(){
    const { activePlaylist, playlistList } = this.state;
    return (
      <Menu.Item>Playlist
        <Menu.Menu>
          {_.map(playlistList, listee => {
            return (
              <Menu.Item key={listee.name} name={`${listee.name}`} active={activePlaylist === `${listee.name}`} onClick={this.handleItemClick}>{listee.name}</Menu.Item>
            )
          })}
        </Menu.Menu>
      </Menu.Item>
    )
  }

  renderPlaylistDropDown(){
    const { activePlaylist, playlistList } = this.state;
    return (
    <Dropdown item text='Playlist'>
      <Dropdown.Menu>
        {_.map(playlistList, listee => {
          return (
            <Dropdown.Item key={listee.name} name={`${listee.name}`} active={activePlaylist === `${listee.name}`} onClick={this.handleItemClick}>
              {listee.name}
            </Dropdown.Item>
          )
        })}
      </Dropdown.Menu>
    </Dropdown>
    )
  }

  render() {
    const { playlist, windowWidth } = this.state;
    const {auth, user} = this.props;

    return (
      <Menu style={windowWidth >= 767 ? floatLeft : null} pointing secondary vertical={windowWidth >= 767}>
        {/*<Menu.Item>*/}
          {/*<Input placeholder='Search...' />*/}
        {/*</Menu.Item>*/}

        {windowWidth >= 767 ? this.renderPlaylistMenuItems() : this.renderPlaylistDropDown()}

        {auth.currentUser.uid === user.data.id &&
         <Dropdown item text='Settings'>
           <Dropdown.Menu>
             <Form onSubmit={this.handleSubmit}>
               <Form.Group style={cssFormGroup}>
                 <Form.Input onChange={this.handleChange} onClick={e => e.stopPropagation()}
                  name={'playlist'} value={playlist} placeholder='Create Playlist' />
                 <Form.Button icon='plus' />
               </Form.Group>
             </Form>
           </Dropdown.Menu>
         </Dropdown>
        }
      </Menu>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  playlist: state.playlist
});

export default connect(mapStateToProps,
  {createPlaylist, checkPlaylistNameExist, getPlaylistOnce, getPlaylistOptions})
(PlaylistMenu);

const cssFormGroup = {
  margin: '0'
};

const floatLeft = {
  float: 'left'
};

