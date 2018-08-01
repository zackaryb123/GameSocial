import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Segment, Grid, List, Image} from 'semantic-ui-react';
// import _ from 'lodash';

import Logo from '../../ui/assets/img/logo.PNG'


class FooterBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'FooterBar'
    };
      // console.log(this.state.name, "Constructor");
  }

    componentWillMount() {
      // console.log(this.state.name, "Will Mount");
    }

    componentDidMount() {
      // console.log(this.state.name,"Did Mount");
    }

    componentWillReceiveProps(nextProps) {
      // console.log(this.state.name, "Will Receive Props", nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
      // console.log("Should", this.state.name, "Update", nextProps, nextState);
      return true;
    }

    componentWillUpdate(nextProps, nextState) {
      // console.log(this.state.name ,"Will Update", nextProps, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
      // console.log(this.state.name, "Did Update", prevProps, prevState)
    }

    componentWillUnmount(){
      // console.log(this.state.name, "Will Unmount");
    }



  render() {
    // console.log('render', this.state.name);
    const Logo = require.resolve('./../../ui/assets/img/logo.PNG');
    return (
        <Segment>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column textAlign='justified' width={12}>
                <List celled horizontal>
                  <List.Item style={{borderLeft: 'none'}}><Image as={Link} to={'/'} size='tiny' src={Logo}/></List.Item>
                  <List.Item><Link to={'/about-us'}>About Us</Link></List.Item>
                  <List.Item><Link to={'/community-rules'}>Community Rules</Link></List.Item>
                  <List.Item style={{borderRight: 'none'}}><Link to={'/contact-us'}>Contact Us</Link></List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={4}>
                <List horizontal bulleted floated='right'>
                  <List.Item as={Link} to='/'><List.Icon size='large' name='facebook'/></List.Item>
                  <List.Item as={Link} to='/'><List.Icon size='large' name='twitter'/></List.Item>
                  <List.Item as={Link} to='/'><List.Icon size='large' name='instagram'/></List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps,
  {})(FooterBar);
