const mongoose = require("mongoose");
const User = require("./userModel");

const bookingsSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a tour"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"],
  },
  price: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: { type: Boolean, default: true },
});

bookingsSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });

  next();
});

const Booking = mongoose.model(bookingsSchema);

module.exports = Booking;
