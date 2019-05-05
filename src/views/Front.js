import React from 'react';
import PropTypes from 'prop-types';
import ImageGrid from '../components/ImageGrid';
import {tokenCheck} from '../utils/MediaAPI';
import {GridList, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = () => ({
  list: {
    maxWidth: 1075,
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
  },
});

const Front = (props) => {
  const {classes} = props;

  tokenCheck(localStorage.getItem('Login-token')).then(data => {
    if (data.message) {
      props.history.push('/');
    }
  });

  return (
      <React.Fragment>
        <Typography variant="h2" gutterBottom style={{textAlign: 'center'}}>Catalog</Typography>
        <GridList className={classes.list}>
          <ImageGrid picArray={props.picArray} edit={false}/>
        </GridList>

      </React.Fragment>
  );
};

Front.propTypes = {
  picArray: PropTypes.array,
  history: PropTypes.object,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Front);