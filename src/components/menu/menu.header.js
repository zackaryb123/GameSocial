import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {Header, Menu, Image, Dropdown, Button, Icon} from 'semantic-ui-react'
import {signOut} from "../../actions/actions.auth";
import {openUploadModal} from "../../actions/actions.modals";

// import _ from 'lodash';

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Header Menu',
      activeItem: null,
      windowWidth: null,
      dropped: false,
      signedOut: null,
      authLoading: false
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
    // Event listener to watch the window width change
    window.addEventListener("resize", function(event) {
      thisComponent.setState({windowWidth: document.body.clientWidth});
      console.log('Window Width:', thisComponent.state.windowWidth);
    })
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth} = this.props;
    if(auth.loading){this.setState({authLoading: true })}
    else{console.log('Props up to date')}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    if(nextState.signedOut){return true}
    else if(nextState.dropped !== this.state.dropped){return true}
    else if(nextState.windowWidth !== this.state.windowWidth) {return true}
    else if(nextState.authLoading){return true}
    else if(nextState.activeItem !== this.state.activeItem){return true}
    else{ console.log('Header Menu up to date')}
    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    // console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.state.name, "Did Update", prevProps, prevState)
    if(this.state.signedOut){this.setState({signedOut: null})}
    else if(this.state.authLoading){this.setState({authLoading: false})}
    else{return null}
  }

  componentWillUnmount(){
    // console.log(this.state.name, "Will Unmount");
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
    // Redirect to home page on sign out to only allow one login entry container.
    if(this.state.signedOut){
      return <Redirect to='/'/>
    }

    const Logo = 'http://www.placeholde.com/350x270';
    // = require.resolve('./../../ui/assets/img/logo.PNG');
    const { activeItem, windowWidth, dropped } = this.state;
    return (
      <Menu stackable fixed='top' inverted pointing style={{backgroundColor: '#696969'}}>

        <Menu.Item name='home' style={{margin: '0'}} active={activeItem === 'home'} onClick={this.handleItemClick} as={Button}>
          <Header as={Link} to='/'>Game Social</Header>
          {/*<Image as={Link} to='/' size='tiny' src={Logo} />*/}
        </Menu.Item>

        <Button fluid secondary style={windowWidth > 748 ? {display: 'none'}: {display: 'block', marginTop: '-3rem', backgroundColor: '#696969'}} icon>
          <Icon size='large' onClick={this.handleDropDown} name={dropped ? 'angle double up':'angle double down' } />
        </Button>

        <Menu.Item as={Link} to='/feed' style={(windowWidth <= 748) && !dropped ? {display: 'none'}: null}
          icon={{name: 'signal'}}
          name='feed'
          active={activeItem === 'feed'}
          onClick={this.handleItemClick}/>

        <Menu.Item as={Link} to='/discover' style={(windowWidth <= 748) && !dropped ? {display: 'none'}: null}
          icon={{name: 'world'}}
          name='discover'
          active={activeItem === 'discover'}
          onClick={this.handleItemClick}/>

        <Menu.Menu position='right' style={(windowWidth <= 748) ? {display: !dropped ? 'none': 'block'}: {position: 'absolute', height: '100%', right: '0'}}>
          <Menu.Item name='upload' active={activeItem === 'upload'} onClick={this.handleItemClick}>
            <Button secondary style={{backgroundColor: '#696969'}} icon={{name: 'upload', size: 'large'}} onClick={this.openUploadModal.bind(this)} name={'upload'}/>
          </Menu.Item>

          {auth.currentUser &&
          <Dropdown item={true} name='profile' icon={{ name: 'user outline', size: 'large' }} active={(activeItem === 'profile').toString()} onClick={this.handleItemClick}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profile/${auth.currentUser.uid}`}>profile</Dropdown.Item>
              <Dropdown.Item as={Link} to='/settings'>Settings</Dropdown.Item>
              <Dropdown.Item onClick={this.handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}
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

