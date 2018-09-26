const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');

const Album = mongoose.model('Album');
const Post = mongoose.model('Post');

module.exports = app => {
  app.post('/api/albums', requireAuth, async (req, res) => {
    try {
      const { albumName, albumPosts } = req.body;

      // Default cover image: last image in array
      const coverImgId = albumPosts[albumPosts.length - 1];
      const coverImgDoc = await Post.findById({_id: coverImgId}, 'imgUrl');

      const album = await new Album({
        name: albumName,
        _owner: req.user.id,
        coverImg: coverImgDoc.imgUrl,
        createdAt: Date.now(),
        posts: albumPosts
      }).save();
      res.status(200).send(album);
    } catch (e) {
      console.log(e);
    }
  });

  // Get a user's albums (protected)
  app.get('/api/albums/myalbums', requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const albums = await Album.find({ _owner: userId }, '_id name coverImg');
      res.status(200).send(albums);
    } catch (e) {
      console.log(e);
    }
  });

  // Get a single album
  app.get('/api/albums/get/:id', async (req, res) => {
    try {
      const album = await Album.findById(req.params.id, 'posts');
      console.log(album);
      const posts = await Post.find({_id: {$in: album.posts}}, 'imgUrl');
      console.log(posts);
      res.status(200).send(posts);
    } catch (e) {
      console.log(e);
    }
  })
};