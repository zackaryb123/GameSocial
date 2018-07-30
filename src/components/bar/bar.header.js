import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Menu, Image, Dropdown, Button, Icon} from 'semantic-ui-react'
import {signOut} from "../../actions/actions.auth";
// import _ from 'lodash';

import Logo from '../../logo.PNG'

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'HeaderBar',
      activeItem: 'home',
      windowWidth: null,
      dropped: false
    };
    console.log(this.state.name, "Constructor");
  }

  componentWillMount() {
    console.log(this.state.name, "Will Mount");
    this.setState({windowWidth: document.body.clientWidth});
  }

  componentDidMount() {
    console.log(this.state.name,"Did Mount");

    let thisComponent = this;
    // Event listener to watch the window width change
    window.addEventListener("resize", function(event) {
      thisComponent.setState({windowWidth: document.body.clientWidth});
      console.log('Window Width:', thisComponent.state.windowWidth);
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.state.name, "Will Receive Props", nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("Should", this.state.name, "Update", nextProps, nextState);
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.name, "Did Update", prevProps, prevState)
  }

  componentWillUnmount(){
    console.log(this.state.name, "Will Unmount");
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleSignOut = (e) => this.props.signOut();
  handleDropDown = (e) => this.setState({dropped: !this.state.dropped});


  render() {
    const { activeItem, windowWidth, dropped } = this.state;
    return (
      //<Segment>
        <Menu stackable style={{borderRadius: '.3rem'}} fixed='top' inverted pointing>
          <Menu.Item><Image as={Link} to='/' size='tiny' src={Logo} /></Menu.Item>

          <Button secondary style={windowWidth > 748 ? {display: 'none'}: {display: 'block', marginTop: '-3rem'}} icon>
            <Icon size='large' onClick={this.handleDropDown} name={dropped ? 'angle double up':'angle double down' } />
          </Button>

          <Menu.Item as={Link} to='/community' style={(windowWidth <= 748) && !dropped ? {display: 'none'}: null}
            icon={{name: 'signal'}}
            name='community'
            active={activeItem === 'community'}
            onClick={this.handleItemClick}/>

          <Menu.Item as={Link} to='/discover' style={(windowWidth <= 748) && !dropped ? {display: 'none'}: null}
            icon={{name: 'world'}}
            name='discover'
            active={activeItem === 'discover'}
            onClick={this.handleItemClick}/>

          <Dropdown style={(windowWidth <= 748) ? {display: !dropped ? 'none': 'block'}: {position: 'absolute', height: '100%', right: '0'}}
            item icon={{name: 'user outline', size: 'large'}}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/profile'>profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item onClick={this.handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
      //</Segment>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps,
  {signOut})(HeaderBar);

