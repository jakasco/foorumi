import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from 'react-router-dom';

const styles = {
  root: {
    flexGrow: 1,
    justifyContent: 'right',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  bar: {
    margin: '0 auto',
    background: 'linear-gradient(#51bcbe, #b3d6c0)',
    position: 'static',
  },

};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.bar}>


            <Link to="/home">
              <Button color="inherit">Home</Button>
            </Link>
            <Link to="/upload">
              <Button color="inherit">Create new thread</Button>
            </Link>
            <Link to="/profile">
              <Button color="inherit">Profile</Button>
            </Link>
            <Link to="/my-files">
              <Button color="inherit">My threads</Button>
            </Link>
            <Link to="/logout">
              <Button color="inherit">Logout</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);