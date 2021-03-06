import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Segment, Grid, List, Image, Header, Menu } from "semantic-ui-react";
// import _ from 'lodash';


class FooterBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'FooterBar'
    };
      // console.log(this.state.name, "Constructor");
  }

  render() {
    const Logo = 'http://www.placeholde.com/400x320';
    //= require.resolve('./../../ui/assets/img/logo.PNG');
    return (
          <Grid style={cssFooter} container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column textAlign='justified' width={12}>
                <List celled horizontal>
                  <List.Item style={{borderLeft: 'none'}}>
                    <Header as={Link} to='/'>Game Social</Header>
                  </List.Item>
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
            <Grid.Row>
              <Grid.Column>
                <List celled horizontal>
                  <List.Item><Link to={'/privacy-policy'}>Privacy Policy</Link></List.Item>
                  <List.Item><Link to={'/privacy-policy'}>Terms & Conditions</Link></List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps,
  {})(FooterBar);

const cssFooter = {
  marginTop: '5rem'
};