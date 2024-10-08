// const mongoose = require("mongoose");
// const slugify = require("slugify");
// const User = require("./userModel");

// const toursSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "A tour must have a name"],
//       unique: true,
//       trim: true,
//       maxlength: [40, "A tour name must have less or equal 40 characters"],
//       minlength: [10, "A tour must have min 10 characters"],
//     },
//     slug: String,
//     duration: {
//       type: Number,
//       required: [true, "A tour must have a duration"],
//     },
//     maxGroupSize: {
//       type: Number,
//       required: [true, "A tour must have a group size"],
//     },

//     difficulty: {
//       type: String,
//       required: [true, "A tour must have a difficulty"],
//       enum: {
//         values: ["easy", "medium", "difficult"],
//         message: " Difficulty",
//       },
//     },
//     ratingsAverage: {
//       type: Number,
//       default: 4.5,
//       min: [1, "Rating must be above 1.0"],
//       max: [5, "Rating must be equal to or less than 5"],
//     },
//     ratingsQuantity: {
//       type: Number,
//       default: 0,
//     },
//     price: {
//       type: Number,
//       required: [true, "A tour must have a name"],
//     },
//     priceDiscount: {
//       type: Number,
//       validate: {
//         validator: function (val) {
//           // this only points to current doc on new creation
//           return val < this.price;
//         },
//         message: "Set correct discount price",
//       },
//     },
//     summary: {
//       type: String,
//       trim: true,
//       required: [true, "A tour must have a description"],
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     imageCover: {
//       type: String,
//       required: [true, " A tour must have a cover image"],
//     },
//     images: [String],
//     createdAt: {
//       type: Date,
//       default: Date.now(),
//       select: false,
//     },

//     startDates: [Date],
//     secretTour: {
//       type: Boolean,
//       default: false,
//     },

//     startLocation: {
//       // GeoJson geospatial data
//       type: {
//         type: String,
//         default: "Point",
//         enum: ["Point"],
//       },
//       coordinates: [Number],
//       address: String,
//       description: String,
//     },

//     locations: [
//       {
//         type: {
//           type: String,
//           default: "Point",
//           enum: ["Point"],
//         },
//         coordinates: [Number],
//         address: String,
//         description: String,
//         day: Number,
//       },
//     ],

//     guides: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//       },
//     ],
//   },

//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// toursSchema.virtual("durationWeeks").get(function () {
//   return this.duration / 7;
// });

// //Virtual populate
// toursSchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "tour",
//   localField: "_id",
// });

// // Document Middleware before .save() and .create()
// toursSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// //Query Middleware

// toursSchema.pre("find", function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// toursSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__V -passwordChangedAt",
//   });

//   next();
// });

// //Aggregation middleware

// toursSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

// const Tour = mongoose.model("Tours", toursSchema);

// module.exports = Tour || mongoose.model("Tour", toursSchema);

const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal 40 characters"],
      minlength: [10, "A tour must have min 10 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be equal to or less than 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below the regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//tourSchema.index({ price: 1 });

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual populate for reviews
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// Document Middleware before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }).populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

// Aggregation Middleware
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
