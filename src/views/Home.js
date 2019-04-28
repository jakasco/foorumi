import React from 'react';
import PropTypes from 'prop-types';
import {GridList} from '@material-ui/core';
import {tokenCheck} from '../utils/MediaAPI';

const Home = (props) => {
  tokenCheck(localStorage.getItem('Login-token')).then(data => {
    if (data.message) {
      props.history.push('/');
    }
  });

  return (
      <GridList>

      </GridList>
  );
};

Home.propTypes = {
  picArray: PropTypes.array,
  history: PropTypes.object,
};

export default Home;

