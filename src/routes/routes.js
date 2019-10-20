const express = require('express');
const Link = require('../models/link');
const router = express.Router();
const pastHour = require('../modules/pastHour');

router.get('/links', (req, res) => {
  Link.find({}, (err, data) => {
    if (err) return res.json({success: false, error: err});
    return res.json({success: true, data: data});
  });
});

router.get('/link/:word', (req, res) => {
  Link.findOne({word: req.params.word}, (err, data) => {
    if (err) return res.json({success: false, error: err});
    if (data === null) return res.json({success: false, error: err});
    if (pastHour(data.updatedAt)) {
      return res.json({success: false, error: "The word is expired"})
    }
    return res.json({success: true, url: data.url, word: data.word, updatedAt: data.updatedAt});
  })
});

router.post('/link', (req, res) => {
  const serveLink = (link) => res.status(200).json({success: true, ... link});
  const serveBadRequest = (err) => res.status(400).json({success: false, error: err});
  const serveError = (err) => res.status(500).json({success: false, error: err});
  const getLastHourQuery = (word) => {
    return {
      word: word,
      updatedAt: {
        $gt: new Date(Date.now() - (60*60) * 1000)
      }
    }
  };

  let {word, url} = req.body;
  if (!url.includes('https://') && !url.includes('http://')) {
    url = `https://${url}`;
  }
  const query = Link.findOne(getLastHourQuery(word)).exec();
  query
    .then(link => link ? Promise.reject(link) : null)
    .then(() => {
      Link
        .findOneAndUpdate({word: word}, {url: url}, {upsert: true, new: true})
        .exec()
        .then(link => link ? serveLink(link) : Promise.reject("Internal Error: Failed to update"))
        .catch(err => serveError(err));
    })
    .catch(err => err.word ? serveBadRequest(err) : serveError(err));
});

router.delete('/link', (req, res) => {
  const {word} = req.body;
  Link.deleteOne({word: word}, (err) => {
    if (err) {
      return res.send(err);
    }
    return res.json({success: true});
  });
});

module.exports = router;
