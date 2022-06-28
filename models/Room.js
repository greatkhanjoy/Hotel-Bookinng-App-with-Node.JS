const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
    },
    maxPeople: {
      type: Number,
      required: [true, 'Max people is required'],
    },
    desc: {
      type: String,
      required: [true, 'Description is required'],
    },
    roomNumbers: [
      {
        number: Number,
        unAvailableDates: { type: [Date] },
      },
    ],
  },
  { timestamps: true }
)

RoomSchema.post('remove', async function () {
  const hotel = await this.model('Hotel').findOneAndUpdate(
    { rooms: this._id },
    { $pull: { rooms: this._id } }
  )

  console.log(hotel)
})

module.exports = mongoose.model('Room', RoomSchema)
