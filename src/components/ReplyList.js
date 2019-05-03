import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {ratePost, getPostRate} from '../utils/MediaAPI';
import {
  GridList,
  GridListTile,
  Button,
  ListSubheader,
} from '@material-ui/core';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const replyStyle = {
  'height' : '30vh',
  'width' : '20%',
  'backgroundColor' : 'beige'
}

let totalRate = 0;

const rateThisPost = (fileId) => {

  console.log("Tää "+fileId);
  ratePost(fileId).then(response => {
    console.log("Tää annettu!");
    getPostRate(fileId).then(response => {
      console.log("Rate haettu",response);

      for(let i=0; i<response.length; i++){
          totalRate += response[i].rating;
      }
      console.log("Total rate: "+totalRate); //TÄÄ ÄÄNET!!
      return totalRate;
    });
  });
}


class ReplyList extends Component {

  state = {
    pics: [],
  }

  componentWillMount(){
    console.log("Props ReplyList: ",this.props.picArray);
    this.state.pics = this.props.picArray;
    console.log("State ReplyList: ",this.state.pics);
    this.forceUpdate();
  }



render(){

if (!this.state.picArray){
  return <div>Loading...</div>
}else{

  return (
      <GridList style={replyStyle}>
    {/*   <GridListTile key="Subheader" cols={1} style={{height: 'auto'}}>
          <ListSubheader component="div">Files</ListSubheader>
        </GridListTile> */}
        <ul>
        {this.props.picArray.map(tile => (
            <li>
            <React.Fragment key={tile.file_id}>
            <div >
            <img src={mediaUrl + tile.filename} alt={tile.title}
            />
            <p><b>Reply:</b>{tile.description}</p>
            <p>Rate: {totalRate}</p>
            </div>
            {/*
              <GridListTile>
                {tile.media_type === 'image' &&
                <img src={mediaUrl + tile.file_id} alt={tile.title}
                />
                }
                {tile.media_type === 'video' &&
                <img src={mediaUrl + tile.thumbnails.w160} alt={tile.title}/>
                }
                {tile.media_type === 'audio' &&
                <img src="img/audio.png" alt={tile.title}/>
                }
              </GridListTile> */}
              {/*Tähän voi lisätä pisteytys systeemin */}
              <button onClick={e => rateThisPost(tile.file_id)}>Anna tää</button>
            </React.Fragment>
            </li>
        ))}
        </ul>
      </GridList>

  );
}//else
};
};

ReplyList.propTypes = {
  picArray: PropTypes.array,

};

export default ReplyList;
