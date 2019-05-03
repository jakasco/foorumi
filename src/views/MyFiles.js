import React, {Component} from 'react';
// import Table from '../components/Table';
import PropTypes from 'prop-types';
import ImageGrid from '../components/ImageGrid';
import {deleteMedia, getMediaFromUser} from '../utils/MediaAPI';


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
          <ImageGrid picArray={this.state.picArray} edit={true}
                     deleteFile={this.deleteFile}/>
        </React.Fragment>
    );
  }
}

MyFiles.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

export default MyFiles;