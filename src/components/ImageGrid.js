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

const ImageGrid = (props) => {
  return (
      <GridList>
        <GridListTile key="Subheader" cols={1} style={{height: 'auto'}}>
          <ListSubheader component="div">Files</ListSubheader>
        </GridListTile>
        {props.picArray.map(tile => (

            <React.Fragment key={tile.file_id}>
              <GridListTile>
                {tile.media_type === 'image' &&
            <img src={mediaUrl + tile.filename} style={{'width':'10%'}} alt={tile.title}
                />
                }
                {tile.media_type === 'video' &&
                <img src={mediaUrl + tile.thumbnails.w160} alt={tile.title}/>
                }
                {tile.media_type === 'audio' &&
                <img src="img/audio.png" alt={tile.title}/>
                }
              </GridListTile>
              <Button size="small" color="primary" component={Link}
                      to={'/single/' + tile.file_id}>
                View
              </Button>
            </React.Fragment>

        ))}
      </GridList>

  );
};

ImageGrid.propTypes = {
  picArray: PropTypes.array,

};

export default ImageGrid;
