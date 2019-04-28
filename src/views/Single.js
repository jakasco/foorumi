import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getSingleMedia, tokenCheck, getComments} from '../utils/MediaAPI';

class Single extends Component {
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  state = {
    file: {},
    comments: [],
  };

  componentDidMount() {
    const {match: {params}} = this.props;
    getSingleMedia(params.id).then(file => {
      this.setState({file: file});
    });

    getComments(this.state.file.file_id).then(data => {
      this.setState({comments: data.comments});
    });

    tokenCheck(localStorage.getItem('Login-token')).then(data => {
      if (data.message) {
        localStorage.clear();
        this.props.history.push('/');
      } else {
        this.setState({user: data});
      }
    });
  }

  getDescription = (text) => {
    const pattern = '\\[d\\]((.|[\\r\\n])*?)\\[\\/d\\]';
    const re = new RegExp(pattern);
    //console.log(re.exec(text));
    try {
      return re.exec(text)[1];
    } catch (e) {
      return text;
    }
  };

  render() {
    return (
        <React.Fragment>
          <h1>{this.state.file.title}</h1>
          <div id="container">
            {(this.state.file.media_type === 'image' &&
                <img src={this.mediaUrl + this.state.file.filename}
                     alt={this.state.file.title}/>)
            || (this.state.file.media_type === 'video' &&
                <video src={this.mediaUrl + this.state.file.filename}
                       alt={this.state.file.title} controls
                       poster={this.mediaUrl + this.state.file.screenshot}/>)
            || (this.state.file.media_type === 'audio' &&
                <audio controls src={this.mediaUrl + this.state.file.filename}
                       alt={this.state.file.title}/>)
            }
          </div>
          <p>{this.getDescription(this.state.file.description)}</p>
          <br/>
          <br/>
          <br/>
          <h4>Comment section</h4>
          {(this.state.comments !== undefined &&
            this.state.comments.map(comments => (
              <div key={comments.comment_id}>
              <p>{comments.time_added +': '+ comments.comment}</p>
              </div>
          )))
          || <p>No comments found</p>}
        </React.Fragment>
    );
  }
}

Single.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default Single;