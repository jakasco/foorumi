import React from 'react';
import PropTypes from 'prop-types';
import {GridList, GridListTile, ListSubheader} from '@material-ui/core';
import {tokenCheck} from '../utils/MediaAPI';

const Home = (props) => {
  tokenCheck(localStorage.getItem('Login-token')).then(data => {
    if (data.message) {
      props.history.push('/');
    }
  });

  return (
      <GridList>
        <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
          <ListSubheader component="div">Home</ListSubheader>
          <p>tähän lankojen lataus</p>
        </GridListTile>
      </GridList>
  );
};

Home.propTypes = {
  picArray: PropTypes.array,
  history: PropTypes.object,
};

export default Home;

