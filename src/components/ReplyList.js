import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
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

const ReplyList = (props) => {
  console.log("Props ReplyList: ",props);
  return (
      <GridList style={replyStyle}>
    {/*   <GridListTile key="Subheader" cols={1} style={{height: 'auto'}}>
          <ListSubheader component="div">Files</ListSubheader>
        </GridListTile> */}
        <ul>
        {props.picArray.map(tile => (
            <li>
            <React.Fragment key={tile.file_id}>
            <div >
            <img src={mediaUrl + tile.filename} alt={tile.title}
            />
            <p><b>Reply:</b>{tile.description}</p>
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
            </React.Fragment>
            </li>
        ))}
        </ul>
      </GridList>

  );
};

ReplyList.propTypes = {
  picArray: PropTypes.array,

};

export default ReplyList;
