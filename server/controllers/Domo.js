const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.color) {
    return res.status(400).json({ error: 'Name, age, and color are all are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    color: req.body.color,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, color: newDomo.color });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getDomos = (req, res) => {
  Domo.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured!' });
    }
    return res.json({ domos: docs });
  });
};

const deleteDomo = (req, res) => {
  Domo.deleteDomoByID(req.body.domoID, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured!' });
    }

    return res.json({ message: 'Domo has been deleted' });
  });
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
