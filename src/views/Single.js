import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getSingleMedia, tokenCheck, getComments, getFilesWithTag} from '../utils/MediaAPI';
import Reply from './Reply';
import ReplyList from '../components/ReplyList';

class Single extends Component {
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  state = {
    file: {},
    comments: [],
    replys: [],
  };

  componentDidMount() {
    const {match: {params}} = this.props;
    getSingleMedia(params.id).then(file => {
      this.setState({file: file});
      console.log("File: ",file);

      //Langan oma id
      const threadId = "Thread"+file.file_id;

      //haetaan kaikki viestit jotka lisätty lankaan
      getFilesWithTag(threadId).then(pics => {
      console.log("Tag list: ",pics);
      this.state.replys = pics;
      });
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
          <hr/>
          <ReplyList picArray={this.state.replys} />
          <Reply fileId={this.state.file.file_id}/>
        </React.Fragment>
    );
  }
}

Single.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default Single;
