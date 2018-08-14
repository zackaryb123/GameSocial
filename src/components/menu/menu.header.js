import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {Header, Menu, Image, Dropdown, Button, Icon} from 'semantic-ui-react'
import {signOut} from "../../actions/actions.auth";
import {openUploadModal} from "../../actions/actions.modals";

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
  handleDropDown = (e) => this.setState({dropped: !this.state.dropped});
  openUploadModal() {this.props.openUploadModal()}


  render() {
    // console.log(this.state.name, 'Render');
    const {auth} = this.props;

    const Logo = 'http://www.placeholde.com/350x270';
    // = require.resolve('./../../ui/assets/img/logo.PNG');

    const { activeItem, windowWidth, dropped } = this.state;
    return (
      <Menu stackable fixed='top' inverted pointing style={{backgroundColor: '#696969'}}>

        <Menu.Item name='home' style={{margin: '0'}} active={activeItem === 'home'} onClick={this.handleItemClick} as={Button}>
          <Header as={Link} to='/'>Game Social</Header>
          {/*<Image as={Link} to='/' size='tiny' src={Logo} />*/}
        </Menu.Item>

        <Button fluid secondary style={windowWidth >= 767 ? {display: 'none'}: {display: 'block', marginTop: '-3rem', backgroundColor: '#696969'}} icon>
          <Icon size='large' onClick={this.handleDropDown} name={dropped ? 'angle double up':'angle double down' } />
        </Button>

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

        <Menu.Menu position='right' style={(windowWidth < 767) ? {display: !dropped ? 'none': 'block'}: {position: 'absolute', height: '100%', right: '0'}}>
          <Menu.Item name='upload' active={activeItem === 'upload'} onClick={this.handleItemClick}>
            <Button secondary style={{backgroundColor: '#696969'}} icon={{name: 'upload', size: 'large'}} onClick={this.openUploadModal.bind(this)} name={'upload'}/>
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

