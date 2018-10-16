import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {Header, Menu, Image, Dropdown, Button, Icon} from 'semantic-ui-react'
import {signOut} from "../../actions/actions.auth";
import {openUploadModal} from "../../actions/actions.modals";
import _ from "lodash";

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Header Menu',
      activeItem: null,
      windowWidth: null,
    };
    // console.log(this.state.name, "Constructor");
  }

  componentWillMount() {
    // console.log(this.state.name, "Will Mount");
    this.setState({windowWidth: document.body.clientWidth});
  }

  componentDidMount() {
    // console.log(this.state.name,"Did Mount");
    let thisComponent = this;
    window.addEventListener("resize", function(event) {
      thisComponent.setState({windowWidth: document.body.clientWidth});
      console.log('Window Width:', thisComponent.state.windowWidth);
    })
  }

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name });
  handleSignOut = (e) => {
    this.setState({signedOut: true});
    this.props.signOut();
  };
  // handleDropDown = (e) => this.setState({dropped: !this.state.dropped});
  openUploadModal(e, {name}) {
    // this.handleItemClick();
    this.props.openUploadModal()
  }


  render() {
    const {auth} = this.props;
    const { activeItem, windowWidth, dropped, signedOut } = this.state;

    const Logo = 'http://www.placeholde.com/350x270';
    // = require.resolve('./../../ui/assets/img/logo.PNG');

    return (
      <Menu stackable fixed='top' inverted pointing style={{backgroundColor: '#696969'}}>

        <Menu.Item name='home' style={{margin: '0'}} active={activeItem === 'home'} onClick={this.handleItemClick} as={Button}>
          <Header as={Link} to='/'>Game Social</Header>
          {/*<Image as={Link} to='/' size='tiny' src={Logo} />*/}
        </Menu.Item>

        <Menu.Menu position="right" style={(windowWidth >= 767) ? {display: !dropped ? 'none': 'block'}: {position: 'absolute', height: '100%', right: '0'}}>
        <Dropdown
          style={(windowWidth >= 767)? {display: 'none'}: null}
          item={true} name='angle down' icon={{ name: 'angle down', size: 'large' }} active={(activeItem === 'profile').toString()} onClick={this.handleItemClick}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={`/feed`}>Feed</Dropdown.Item>
            <Dropdown.Item as={Link} to='/discover'>Discover</Dropdown.Item>
            <Dropdown.Item onClick={this.openUploadModal.bind(this)}>Upload</Dropdown.Item>
            {auth.currentUser && !auth.loading ? <Dropdown.Item as={Link} to={`/profile/${auth.currentUser.uid}`}>profile</Dropdown.Item> : <Button loading/>}
            <Dropdown.Item as={Link} to='/settings'>Settings</Dropdown.Item>
            <Dropdown.Item onClick={this.handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </Menu.Menu>

        <Menu.Item as={Link} to='/feed' style={(windowWidth < 767) && !dropped ? {display: 'none'}: null}
          icon={{name: 'signal'}}
          name='feed'
          active={activeItem === 'feed'}
          onClick={this.handleItemClick}/>

        <Menu.Item as={Link} to='/discover' style={(windowWidth < 767) && !dropped ? {display: 'none'}: null}
          icon={{name: 'world'}}
          name='discover'
          active={activeItem === 'discover'}
          onClick={this.handleItemClick}/>

        <Menu.Menu position='right' style={(windowWidth < 767) ? {display: !dropped ? 'none': 'block'}: null}>
          <Menu.Item
            icon={{name: 'upload', size: 'large'}}
            name='upload'
            active={activeItem === 'upload'}
            onClick={this.openUploadModal.bind(this)}>
          </Menu.Item>

          {auth.currentUser && !auth.loading ?
          <Dropdown item={true} name='profile' icon={{ name: 'user outline', size: 'large' }} active={(activeItem === 'profile').toString()} onClick={this.handleItemClick}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profile/${auth.currentUser.uid}`}>profile</Dropdown.Item>
              <Dropdown.Item as={Link} to='/settings'>Settings</Dropdown.Item>
              <Dropdown.Item onClick={this.handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> : <Button loading/>}
        </Menu.Menu>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,
  {signOut, openUploadModal})(HeaderBar);

