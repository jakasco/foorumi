import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getSingleMedia, tokenCheck, getComments, getFilesWithTag,ratePost, getPostRate} from '../utils/MediaAPI';
import Reply from './Reply';
import ImageGrid from '../components/ImageGrid';
import ReplyList from '../components/ReplyList';
import {
  GridList,
  GridListTile,
  Button,
  ListSubheader,
} from '@material-ui/core';

const replyStyle = {
  'height' : '30vh',
  'width' : '20%',
  'backgroundColor' : 'beige'
}
const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';




class Single extends Component {
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  state = {
    file: {},
    comments: [],
    replys: [],
    totalRate: [],
    totalRate2: [[]],
  };

  rateThisPost = (fileId) => {

    let totalRate = [];

    ratePost(fileId).then(response => {
      console.log("Tää annettu!");
      getPostRate(fileId).then(response => {

        for(let i=0; i<this.state.replys.length+1; i++){
      //    console.log("Response["+i+"].file_id: "+response[0].file_id+" / this.state.totalRate2[i][0] "+this.state.totalRate2[i][0]);
          try{
            if(response[0].file_id === this.state.totalRate2[i][0]){
              console.log("Access to "+this.state.totalRate2[i][0]);
              for(let j=0; j<response.length; j++){
                this.state.totalRate2[i][1] += response[j].rating;
              }
            }
          }
        catch{}
        }
        console.table(this.state.totalRate2);
        //  this.setState({render: "render"}); //Jotta renderöidään 2d array
          this.forceUpdate();
      });
    });
  }

  getData = () => {
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

    //  console.table(this.state.totalRate2);

      for(let i=0; i<pics.length; i++){
        this.state.totalRate2.push([pics[i].file_id, 0]);
      }
      console.log("this.state.replys: ",this.state.replys);
      console.log("Total rate2: "+this.state.totalRate2);
      });
        this.forceUpdate(); //Renderöidään lanka avatessa
    });

    getComments(this.state.file.file_id).then(data => {
      this.setState({comments: data.comments});
    });
    console.table(this.state.totalRate2);

  }

  componentWillMount() {
    this.getData();
  }

  componentDidMount() {



    tokenCheck(localStorage.getItem('Login-token')).then(data => {
      if (data.message) {
        localStorage.clear();
        this.props.history.push('/');
      } else {
        this.setState({user: data});
      }
    });
  }

  vaihaState = () => {
    console.log("vaihaStae");
    this.getData();
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

    if(this.state.totalRate2 == null){
      return (
        <div>Loading...</div>
      );

    }else{
      console.table(this.state.totalRate2);
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
          <hr/>
          <button onClick={e => this.vaihaState()}>Vaiha</button>
          <GridList style={replyStyle}>
            <ul>
            {this.state.replys.map((tile, i) => (
                <li>
                <React.Fragment key={tile.file_id}>
                <div >
                <img src={mediaUrl + tile.filename} alt={tile.title}
                />
                <p><b>Reply:</b>{tile.description}</p>
                </div>
                  <button onClick={e => this.rateThisPost(tile.file_id)}>Anna tää</button>
                  <p>Total: {this.state.totalRate2[i+1][1]}</p>
                </React.Fragment>
                </li>
            ))}
            </ul>
          </GridList>
      {/* <ReplyList picArray={this.state.replys} /> */}
          <Reply fileId={this.state.file.file_id}/>
        </React.Fragment>
    );
  }
}
}

Single.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default Single;
