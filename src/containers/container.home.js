import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Grid, Header, Segment, Divider, Icon } from "semantic-ui-react";
import FeaturedSlider from "../components/slider/slider.featured";
import {getFeaturedOnce} from "../actions/actions.featured";
import _ from "lodash";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Home Container"
    };
  }

  componentDidMount(){
    const {auth} = this.props;
    if(!_.isEmpty(auth.currentUser)) {
      this.props.getFeaturedOnce();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {auth} = this.props;

    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser))
    {this.setState({pageRefresh: true})}
    else {console.log('Props up to date')}

  }

  shouldComponentUpdate(nextProps, nextState) {
    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      default: return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.mounted = true;
    const {auth} = this.props;
    const {pageRefresh, page, count} = this.state;

    switch(true) {
      case (pageRefresh):
        this.setState({ pageRefresh: false });
        this.props.getFeaturedOnce();
        break;
      default: return null;
    }
  }

  render() {
    const {auth, featured} = this.props;
    if(_.isEmpty(auth.currentUser) || _.isEmpty(featured.data)){return null}
    return (
      <div>
        <Segment basic textAlign='center' style={{backgroundColor: '#1B1C1D'}}>
          <Header style={{color: 'white'}}>Featured</Header>
        </Segment>

        <div>
          <Grid textAlign="center" style={{ backgroundColor: "#1B1C1D" }}>
            <Grid.Row>
              <Grid.Column width={16} style={{maxWidth: '720px'}}>
                <FeaturedSlider/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  featured: state.featured
});

export default (connect(mapStateToProps, {getFeaturedOnce})(Home));
