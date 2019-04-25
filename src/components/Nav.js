import React from 'react';
import {Link} from 'react-router-dom';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Home, PowerSettingsNew, AddCircle} from '@material-ui/icons';

//lisätää linkkejä sitä mukaan ku tulee komponentteja
const Nav = () => {
  return (
      <nav>
        <List>
          <ListItem button component={Link} to="/home">
            <ListItemIcon>
              <Home/>
            </ListItemIcon>
            <ListItemText primary='Home'/>
          </ListItem>
          <ListItem button component={Link} to="/logout">
            <ListItemIcon>
              <PowerSettingsNew/>
            </ListItemIcon>
            <ListItemText primary="Logout"/>
          </ListItem>
          <ListItem button component={Link} to="/upload">
            <ListItemIcon>
              <AddCircle/>
            </ListItemIcon>
            <ListItemText primary="upload"/>
          </ListItem>
        </List>
      </nav>
  );
};

export default Nav;