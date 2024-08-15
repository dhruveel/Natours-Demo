const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../../../models/tourModel');

dotenv.config({ path: './../../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // UseCreateIndex: true,
    // useFindModify: false,
  })
  .then(() => {
    console.log('Connected successfully');
  });

const tours = JSON.parse(fs.readFileSync('tours.json', 'utf-8'));

//Import data into db

const importData = async () => {
  try {
    await Tour.create(tours);

    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

//Delete all data from collections
const deleteData = async () => {
  try {
    console.log('data deletion started');
    await Tour.deleteMany();

    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
