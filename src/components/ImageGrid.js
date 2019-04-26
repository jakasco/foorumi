import React from 'react';

import PropTypes from 'prop-types';
import {
  GridList,
  GridListTile,

  ListSubheader,

} from '@material-ui/core';



const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';


const ImageGrid = (props) => {
  return (
      <GridList>
        <GridListTile key="Subheader" cols={1} style={{height: 'auto'}}>
          <ListSubheader component="div">Files</ListSubheader>
        </GridListTile>
        {props.picArray.map(tile => (
            <GridListTile key={tile.file_id}>
              {tile.media_type === 'image' &&
              <img src={mediaUrl + tile.thumbnails.w160} alt={tile.title}
                  />
              }
              {tile.media_type === 'video' &&
              <img src={mediaUrl + tile.screenshot} alt={tile.title}/>
              }
              {tile.media_type === 'audio' &&
              <img src="http://placekitten.com/400/400" alt={tile.title}/>
              }

            </GridListTile>
        ))}
      </GridList>
  );
};

ImageGrid.propTypes = {
  picArray: PropTypes.array,

};

export default ImageGrid;