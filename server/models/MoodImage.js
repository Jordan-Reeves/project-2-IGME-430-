// mongoose schema to store image files
const mongoose = require('mongoose');

let MoodImageModel = {};

const MoodImageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
  },
  board: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

MoodImageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return MoodImageModel.find(search).select('name data size mimetype board').lean().exec(callback);
};

MoodImageSchema.statics.deleteByID = (imgID, callback) => {
  const search = {
    // convert the string ownerId to an object id
    _id: mongoose.Types.ObjectId(imgID),
  };

  return MoodImageModel.deleteOne(search).exec(callback);
};

// file model
MoodImageModel = mongoose.model('MoodImage', MoodImageSchema);
module.exports = MoodImageModel;
