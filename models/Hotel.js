const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HotelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Hotel type is required'],
      default: 'hotel',
    },
    city: {
      type: String,
      required: [true, 'Hotel city is required'],
    },
    address: {
      type: String,
      required: [true, 'Hotel address is required'],
    },
    distane: {
      type: Number,
      required: [true, 'Hotel distance is required'],
      default: 0,
    },
    featuredImage: {
      type: String,
      required: [true, 'Hotel Featured image required'],
      default: 'https://via.placeholder.com/150',
    },
    photos: {
      type: [String],
      required: [true, 'Hotel photos are required'],
      default: [],
    },
    desc: {
      type: String,
      required: [true, 'Hotel description is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Hotel rating is required'],
      default: 0,
    },
    rooms: {
      type: [String],
    },
    cheapestPrice: {
      type: Number,
      required: [true, 'Hotel cheapest price is required'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Hotel', HotelSchema)
