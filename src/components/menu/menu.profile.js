import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Container } from "semantic-ui-react";
import Media from "react-media";
import _ from "lodash";

class MenuProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { activeMenu: null };
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

  handleItemClick = (e, { name }) => {
    this.setState({ activeMenu: name });
    this.props.getActiveMenu(name);
  };

  render() {
    const { activeMenu, windowWidth } = this.state;
    const { user } = this.props;
    return (
      <Menu fluid style={cssMenu} inverted tabular>
        <Menu.Item style={windowWidth < 767 ? cssMenuItemMobile : null}
          name="uploads"
          active={activeMenu === "uploads"}
          onClick={this.handleItemClick}
        >Uploads {_.size(user.data.uploads)}
        </Menu.Item>
        <Menu.Item style={windowWidth < 767 ? cssMenuItemMobile : null}
          name="followers"
          active={activeMenu === "followers"}
          onClick={this.handleItemClick}
        >Followers {_.size(user.data.followers)}
        </Menu.Item>
        <Menu.Item style={windowWidth < 767 ? cssMenuItemMobile : null}
          name="following"
          active={activeMenu === "following"}
          onClick={this.handleItemClick}
        >Following {_.size(user.data.following)}
        </Menu.Item>
        <Menu.Item style={windowWidth < 767 ? cssMenuItemMobile : null}
          name="favorites"
          active={activeMenu === "favorites"}
          onClick={this.handleItemClick}
        >Favorites {_.size(user.data.favorites)}
        </Menu.Item>
        <Menu.Item style={windowWidth < 767 ? cssMenuItemMobile : null}
          name="playlist"
          active={activeMenu === "playlist"}
          onClick={this.handleItemClick}
        >Playlist {_.size(user.data.playlist)}
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  // user: state.user
});

export default connect(mapStateToProps)(MenuProfile);

const cssMenu = {
  backgroundColor: 'coral',
  display: 'flex',
  justifyContent: 'space-evenly'
};

// @media only screen and (max-width: 767px).ui.container {
  /* width: auto!important; */
  /* margin-left: 1em!important; */
  /* margin-right: 1em!important; */
// }


// @media only screen and (max-width: 767px).ui.container {
const cssMenuItemMobile = {
  padding: '0.2rem',
  fontSize: '12px'
};