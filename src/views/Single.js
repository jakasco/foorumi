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
  'margin': '10px',
  'height' : '60vh',
  'width' : '90%',
  'backgroundColor' : 'rgba(0, 0, 0, 0.43)',
}

const ulStyle = {
  'marginLeft': '20%',
  'listStyleType':'none',
}

const liStyle = {
'backgroundColor' : 'blue'
}

const divStyle = {
  'display':'inlineBlock'
}

const divStyle2 = {
  'float':'left',
  'width' : '50%',
  'backgroundColor': 'transparent'
}

const divStyle3 = {
  'float':'left',
  'width' : '50%',
  'backgroundColor': 'transparent',
  'height': '50vh',
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
    tTitle: 'Loading...'
  };


  getAllRates = () => {
    getPostRate(0).then(response => {
    console.log("k KERRAN MENTYdadsasd ");
    for(let k=0; k<this.state.replys.length; k++){


    getPostRate(this.state.replys[k].file_id).then(response => {
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
    console.log("k KERRAN MENTY "+k);
  }
  });
  }

  rateThisPost = (fileId) => {

    let totalRate = [];

    ratePost(fileId).then(response => {
      console.log("Tää annettu!");
      getPostRate(fileId).then(response => {

        for(let i=0; i<this.state.replys.length+1; i++){
      //    console.log("Response["+i+"].file_id: "+response[0].file_id+" / this.state.totalRate2[i][0] "+this.state.totalRate2[i][0]);
          try{
            if(response[0].file_id === this.state.totalRate2[i][0]){
      //        console.log("Access to "+this.state.totalRate2[i][0]);
              for(let j=0; j<response.length; j++){
                this.state.totalRate2[i][1] += response[j].rating;
              }
            }
          }
        catch{}
        }
  //      console.table(this.state.totalRate2);
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
      this.state.tTitle = this.state.replys[0].title;
    //  console.table(this.state.totalRate2);

      for(let i=0; i<pics.length; i++){
        this.state.totalRate2.push([pics[i].file_id, 0]);
      }
      this.forceUpdate(); //Renderöidään lanka avatessa
      });
    });

    getComments(this.state.file.file_id).then(data => {
      this.setState({comments: data.comments});
    });
    console.table(this.state.totalRate2);

  }

  componentDidMount() {

    tokenCheck(localStorage.getItem('Login-token')).then(data => {
      if (data.message) {
        localStorage.clear();
        this.props.history.push('/');
      } else {
        this.setState({user: data});
      }
      this.getData();

      this.getAllRates();
    });
  }

//hae vanhat äänet kun avataan ketju
  getRates = (fileId, i) => {

    getPostRate(fileId).then(response => {
      console.log("FileId "+fileId+" i: "+i);
      this.state.totalRate2[i][1] = 0;
      try{
        this.state.totalRate2[i][1] = response[0].rating;
      }catch{}
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
    if(this.state.totalRate2 == null){
      return (
        <div>Loading...</div>
      );

    }else{
      console.table(this.state.totalRate2);
    return (
        <React.Fragment>
        <h1>Title of thread: {this.state.tTitle} </h1>
          <GridList style={replyStyle}>
            <ul style={ulStyle}>

            {this.state.replys.map((tile, i) => (

                <li style={liStyle}>
                <React.Fragment key={tile.file_id}>
                {this.getRates.call(this, tile.file_id, i)}
                <div style={divStyle2}>
                <img src={mediaUrl + tile.filename} alt={tile.title}
                />
                </div>
                <div style={divStyle3}>
                <p><b>Reply:</b>{tile.description}</p>

                  <button onClick={e => this.rateThisPost(tile.file_id)}>+</button>
                  <p>Total Upvotes: {this.state.totalRate2[i+1][1]}</p>
                  </div>
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
