import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/Navigation';

import ImageGrid from '../components/ImageGrid';
import { fetchPosts } from '../actions/posts';

const styles = theme => ({
  circularLoader: {
    margin: '16px auto',
    display: 'block'
  },
  toTopButton: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: '5%',
    right: '5%',
    zIndex: 5000
  },
  navIcon: {
    marginRight: theme.spacing.unit
  }
});

export class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      morePagesAvailable: true,
      isFetching: false,
      pages: [this.props.posts] || [],
      showNavToTop: false
    };

    window.addEventListener('scroll', onScroll, false);

    // Scroll optimization using raf
    const raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame;

    const loadImages = this.loadImages.bind(this);
    const boundSetState = this.setState.bind(this);

    /* global pageYOffset, innerHeight, docOffsetHeight */
    let pageYOffset = 0;
    let innerHeight = 0;
    let docOffsetHeight = 0;
    let ticking = false;

    function onScroll() {
      pageYOffset = window.pageYOffset;
      innerHeight = window.innerHeight;
      docOffsetHeight = document.body.offsetHeight;
      requestTick();
    }

    function requestTick() {
      if (!ticking) {
        raf(update);
      }
      ticking = true;
    }

    function update() {
      ticking = false;

      const currentPageYOffset = pageYOffset;
      const currentInnerHeight = innerHeight;
      const currentDocOffsetHeight = docOffsetHeight;

      if (currentPageYOffset > currentInnerHeight) {
        boundSetState({ showNavToTop: true });
      }
      if (currentPageYOffset < currentInnerHeight) {
        boundSetState({ showNavToTop: false });
      }
      if (currentInnerHeight + currentPageYOffset >= currentDocOffsetHeight) {
        loadImages();
      }
    }
  }

  loadImages = async () => {
    const { posts } = this.props;
    if (this.state.isFetching || !this.state.morePagesAvailable) {
      return;
    }

    // this.setState is not guaranteed to be synchronous, passing a bc guarantees cb will be called after state update
    this.setState({ isFetching: true }, async () => {
      const res = await this.props.fetchPosts(this.state.currentPage);
      if (!res) {
        this.setState({ morePagesAvailable: false }, () => {
          return;
        });
      }

      this.setState(
        {
          currentPage: this.state.currentPage + 1,
          pages: [posts],
          isFetching: false
        },
        () => {
          return;
        }
      );
    });
  };

  componentDidMount() {
    if(this.props.posts.length > 0) {
      return;
    }
    this.setState({ isFetching: true }, async () => {
      await this.props.fetchPosts(this.state.currentPage);
      this.setState({
        pages: [this.props.posts],
        currentPage: this.state.currentPage + 1,
        isFetching: false
      }, () => {
        return;
      });
    });
  }


  
  goTop = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.showNavToTop ? (
          <Button
            id="goTopButton"
            variant="extendedFab"
            aria-label="go-top"
            className={classes.toTopButton}
            onClick={this.goTop}
          >
            <NavigationIcon className={classes.navIcon} />
            Go to Top
          </Button>
        ) : null}
        {this.state.pages.map(page => {
          return page.map(post => <ImageGrid imageData={post} />);
        })}
        {this.state.isFetching ? (
          <CircularProgress className={classes.circularLoader} size={50} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { fetchPosts }
  )
)(Feed);
