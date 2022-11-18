const MoodImage = require('../models/MoodImage.js');

const uploadPage = (req, res) => {
  res.render('app');
};

const uploadFile = async (req, res) => {
  // if there are no files or it is empty
  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const {sampleFile} = req.files;
  sampleFile.owner=req.session.account._id;

  console.log(sampleFile);


  try {

    const newFile = new MoodImage(sampleFile);
    const doc = await newFile.save(); // should be same as new file for us to send to user
    return res.status(201).json({
      message: 'File stored successfully!',
      fileId: doc._id,
    });
  } catch(err){
    console.log(err);
    return res.status(400).json({
      error: 'Error uploading file!',
    });
  }

};

// Get a specific image
const retrieveFile = async (req, res) => {
  if (!req.query._id){
    return res.status(400).json({error: 'Missing file id'})
  }

  let doc;
  try {
    // find one file with the _id value
    // doc = await File.findOne({_id: req.query._id}).exec();
    // or
    doc = await MoodImage.findById(req.query._id).exec();
  } catch(err) {
    console.log(err);
    return res.status(400).json({error: 'Something went wrong retrieving file!'});
  }
  if(!doc){
    return res.status(404).json({ error: 'File not found!' });
  }

  // setting headers
  res.set({
    'Content-Type': doc.mimetype,
    'Content-Length': doc.size,
    'Content-Disposition': `filename="${doc.name}"` // attachment means it will only download it not display it when you retrieve it
  });

  // send the response w the img data
  return res.send(doc.data);

};

// Get all the images from an owner
const getImages = (req, res) => {
    MoodImage.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occured!' });
        }
        return res.json({ moodImages: docs });
    });
    // console.log("testing");
};

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
}