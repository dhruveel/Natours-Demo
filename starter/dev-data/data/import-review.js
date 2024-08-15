const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../../models/tourModel');
const Review = require('../../../models/reviewModel');
const User = require('../../../models/userModel');

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

//const tours = JSON.parse(fs.readFileSync('tours.json', 'utf-8'));

//const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

const reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));

//Import data into db

const importData = async () => {
  try {
    // await Tour.create(tours, { validateBeforeSave: false });
    // await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });

    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
};

// //Delete all data from collections
// const deleteData = async () => {
//   try {
//     console.log('data deletion started');
//     await Tour.deleteMany();

//     console.log('Data successfully deleted');
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  // deleteData();
}

console.log(process.argv);
