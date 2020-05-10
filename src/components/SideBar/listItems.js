import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LayersIcon from '@material-ui/icons/Layers';


export class MainListItems extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { onSelectBgTheme, currentBgTheme } = this.props;
    const selectBgTheme = currentBgTheme === 'dark' ? 'light' : 'dark';
    return (
      <div>
          <ListItem button
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Integrations" />
          </ListItem>
          <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={ (e)  => {onSelectBgTheme(this.handleClose)} }>{selectBgTheme.charAt(0).toUpperCase() + selectBgTheme.slice(1)} Map Background</MenuItem>
          <MenuItem>Theme</MenuItem>
          <MenuItem>Placeholder</MenuItem>
        </Menu>
        </div>
    );
  }
  
}

export const oldMainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);