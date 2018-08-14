import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
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
    this.mounted = true;
    let thisComponent = this;
    window.addEventListener("resize", function(event) {
      if(thisComponent.mounted){
        thisComponent.setState({ windowWidth: document.body.clientWidth })}
    })
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeMenu: name });
    this.props.getActiveMenu(name);
  };

  render() {
    const { activeMenu, windowWidth } = this.state;
    const { user, auth } = this.props;
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
        {auth.currentUser.uid === user.data.id &&
          <Menu.Item style={windowWidth < 767 ? cssMenuItemMobile : null}
            name="playlist"
            active={activeMenu === "playlist"}
            onClick={this.handleItemClick}
          >Playlist {_.size(user.data.playlist)}
          </Menu.Item>
        }
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(MenuProfile);

const cssMenu = {
  backgroundColor: 'coral',
  display: 'flex',
  justifyContent: 'space-evenly'
};

const cssMenuItemMobile = {
  padding: '0.2rem',
  fontSize: '12px'
};