const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');                         //  Joi validations for schema
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const campGroundSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: [0, 'Value Should be eual or greater to Zero (0)']
    },
    discription: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,                                        //  Creating relationship in nosql
        ref: 'Review'
    }]
}, opts)

campGroundSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        title: this.title
    }
})

campGroundSchema.post('findOneAndDelete', async function (doc) {            //  after middleware
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
});

module.exports = mongoose.model('Campground', campGroundSchema);