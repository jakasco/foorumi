import React, {Component} from 'react';
// import Table from '../components/Table';
import PropTypes from 'prop-types';
import ImageGrid from '../components/ImageGrid';
import {deleteMedia, getMediaFromUser} from '../utils/MediaAPI';
import {GridList, Typography, withStyles} from '@material-ui/core';

const styles = () => ({
  list: {
    maxWidth: 1075,
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
  },
});

class MyFiles extends Component {
  state = {
    picArray: [],
  };

  updateUserImages = () => {
    getMediaFromUser(this.props.user.user_id).then((pics) => {
      console.log(pics);
      this.setState({picArray: pics});
    });
  };

  deleteFile = (id) => {
    console.log('delete', id);
    const cnfrm = window.confirm('Really? Delete?');
    if (!cnfrm) {
      return;
    }

    deleteMedia(id, localStorage.getItem('Login-token')).then(response => {
      this.updateUserImages();
    }).catch(err => {
      console.log(err);
    });

  };

  componentDidMount() {
    if (!this.props.user) {
      this.props.history.push('/');
    } else {
      this.updateUserImages();
    }
  }

  render() {
    return (
        <React.Fragment>
          {/* <Table picArray={this.picArray}/> */}
          <Typography variant="h2" gutterBottom>My threads</Typography>
          <GridList className={this.props.classes.list}>
            <ImageGrid picArray={this.state.picArray} edit={true}
                       deleteFile={this.deleteFile}

            />
          </GridList>
        </React.Fragment>
    );
  }
}

MyFiles.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyFiles);