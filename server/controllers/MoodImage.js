const MoodImage = require('../models/MoodImage.js');

// Function to send users to the upload page (the main page of the app)
const uploadPage = (req, res) => {
  res.render('app');
};

// Function to allow users to upload images - only allows images
const uploadFile = async (req, res) => {
  // if there are no files or it is empty
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  // Get the file and add the owner and board to it
  const { sampleFile } = req.files;
  sampleFile.owner = req.session.account._id;
  sampleFile.board = req.query.board;

  // Check that the file is an image and if so try to upload it
  if (sampleFile.mimetype === 'image/png' || sampleFile.mimetype === 'image/jpeg') {
    try {
      const newFile = new MoodImage(sampleFile);
      const doc = await newFile.save(); // should be same as new file for us to send to user
      return res.status(201).json({
        message: 'File stored successfully!',
        fileId: doc._id,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Error uploading file!',
      });
    }
  } else {
    return res.status(400).json({
      error: 'Only PNGs or JPEGs are alllowed',
    });
  }
};

// Function to get a specific image based on the id of the image and then display it
const retrieveFile = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id' });
  }

  let doc;
  try {
    // find one file by the _id value
    doc = await MoodImage.findById(req.query._id).exec();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }
  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  // setting headers
  res.set({
    'Content-Type': doc.mimetype,
    'Content-Length': doc.size,
    'Content-Disposition': `filename="${doc.name}"`, // attachment means it will only download it not display it when you retrieve it
  });

  // send the response w the img data
  return res.send(doc.data);
};

// Function to get all the images from an owner
const getImages = (req, res) => {
  MoodImage.findByOwner(req.session.account._id, req.query.board, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured!' });
    }
    return res.json({ moodImages: docs });
  });
};

// Delete a Mood Image
const deleteMoodImage = (req, res) => {
  MoodImage.deleteByID(req.body.imgID, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured!' });
    }

    return res.json({ message: 'Image has been deleted' });
  });
};

module.exports = {
  uploadPage,
  uploadFile,
  retrieveFile,
  getImages,
  deleteMoodImage,
};
