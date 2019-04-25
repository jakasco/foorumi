import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {Button} from '@material-ui/core';

class Upload extends Component {
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
    fd.append('title', this.state.file.title);
    fd.append('description', this.state.file.description);
    fd.append('file', this.state.file.filedata);
    const options = {
      method: 'POST',
      body: fd,

      headers: {
        'x-access-token': localStorage.getItem('token'),
      }
    };

    fetch(this.mediaUrl + 'media', options).then(response => {
      return response.json();
    }).then(json => {
      console.log(json);
      setTimeout(() => {
        this.props.history.push('/home');
        this.props.getMedia();
        this.setState({loading: false});
      }, 2000);

    });
  };

  render() {
    return (
        <React.Fragment>
          <h1>Upload</h1>
          <ValidatorForm onSubmit={this.handleFileSubmit}
                         onError={errors => console.log(errors)}
                         instantValidate={false}>
            <TextValidator name="title" label="Title" value={this.state.file.title}
                           onChange={this.handleInputChange}
                           validators={[
                             'required',
                             'minStringLength:3']}
                           errorMessages={[
                             'this field is required',
                             'minimum 3 charaters',
                           ]}
                           fullWidth
            />
            <TextValidator name="description" label="Description"
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
            <Button variant='contained' color='primary' type='submit'>Upload&nbsp;{this.state.loading && 'Loading...'}</Button>
          </ValidatorForm>
        </React.Fragment>
    );
  }
}

Upload.propTypes = {
  history: PropTypes.object,
  getMedia: PropTypes.func,
};

export default Upload;