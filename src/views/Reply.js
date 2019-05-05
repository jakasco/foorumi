import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {Button} from '@material-ui/core';
import {addTag} from '../utils/MediaAPI';

class Reply extends Component {
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/';
  state = {
    file: {
      title: '',
      description: '',
      filedata: null,
      filename: undefined,
    },
    loading: false,
  };

  handleFileChange = (evt) => {
    evt.persist();

    console.log(evt.target.files[0]);
    this.setState((prevState) => ({
      file: {
        ...prevState.file,
        filedata: evt.target.files[0],

      },
    }));
  };

  handleInputChange = (evt) => {

    const target = evt.target;
    const value = target.value;
    const name = target.name;

    console.log(value, name);

    this.setState((prevState) => ({
      file: {
        ...prevState.file,
        [name]: value,

      },
    }));
  };



  handleFileSubmit = (evt) => {
    console.log(evt);
    this.setState({loading: true});
    const fd = new FormData();
    fd.append('title', "Reply");
    fd.append('description', this.state.file.description);
    fd.append('file', this.state.file.filedata);
    const options = {
      method: 'POST',
      body: fd,

      headers: {
        'x-access-token': localStorage.getItem('Login-token'),
      }
    };

    fetch(this.mediaUrl + 'media', options).then(response => {
      return response.json();
    }).then(json => {

    const tagi = "Thread"+this.props.fileId;

  //  const appTag = "bksTag";

     //lisätään tägi aina postatessa
    addTag(localStorage.getItem('Login-token'),json.file_id,tagi).then(response => {
      console.log("Tag added: Tagii");
    });

      setTimeout(() => {
    //    this.props.history.push('/home');
    //    this.props.getMedia();
        this.setState({loading: false});
      }, 2000);

    });
  };

  render() {
    return (
        <React.Fragment>
          <h1>Reply to thread</h1>
          <ValidatorForm onSubmit={this.handleFileSubmit}
                         onError={errors => console.log(errors)}
                         instantValidate={false}>
            <TextValidator name="description" label="Your reply:"
                           value={this.state.file.description}
                           onChange={this.handleInputChange}
                           validators={['required', 'minStringLength:3']}
                           errorMessages={[
                             'this field is required',
                             'minimum 3 charaters']}
                           fullWidth
                           multiline
                           rows={3}/>
            <TextValidator name="filedata" label="File" value={this.state.file.filename}
                           onChange={this.handleFileChange}
                           type="file"



                           fullWidth
            />
            <Button variant='contained' color='primary' type='submit'>Reply&nbsp;{this.state.loading && 'Loading...'}</Button>
          </ValidatorForm>
        </React.Fragment>
    );
  }
}

Reply.propTypes = {
  history: PropTypes.object,
  getMedia: PropTypes.func,
};

export default Reply;
