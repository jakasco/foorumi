import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import {withStyles} from '@material-ui/core/styles';
import {OpenWith, Create, Clear, Photo, VideoLabel, Audiotrack} from '@material-ui/icons';
import {
  Button,
  CardActions,
  CardContent,
  CardMedia, IconButton,
  Typography,
} from '@material-ui/core';

const styles = {
  card: {
    maxWidth: 345,
    minWidth: 345,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  media: {
    height: 260,
  },
  comment:{
    height: 80,
    overflowY: 'auto',
  },
};

class ImageGrid extends Component {


  render() {
    return this.props.picArray.map((tile, i) => (

        <Card className={this.props.classes.card} key={i}>
          {(tile.media_type === 'image' &&
              <CardMedia className={this.props.classes.media}
                         image={'http://media.mw.metropolia.fi/wbma/uploads/' +
                         tile.thumbnails.w160} title={tile.title}/>)
          || (tile.media_type === 'video' &&
              <CardMedia className={this.props.classes.media}
                         image={'http://media.mw.metropolia.fi/wbma/uploads/' +
                         tile.thumbnails.w160} title={tile.title}/>)
          || (tile.media_type === 'audio' &&
              <CardMedia className={this.props.classes.media}
                         image='img/audio.png' title={tile.title}/>)
          }

          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" >
              {tile.title}
            </Typography>
            <Typography component="p" className={this.props.classes.comment}>
              {tile.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" component={Link}
                    to={'/single/' + tile.file_id}>
              View
            </Button>
            <IconButton onClick={() => {
              this.props.deleteFile(tile.file_id);
            }}>
              <Clear color="secondary"/>
            </IconButton>
          </CardActions>
        </Card>
    ));
  }
}

ImageGrid.propTypes = {
  picArray: PropTypes.array,
  classes: PropTypes.object.isRequired,
  deleteFile: PropTypes.func,
};

export default withStyles(styles)(ImageGrid);