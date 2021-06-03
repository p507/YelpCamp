const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedsHelpers');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true
})
    .then((data) => {
        console.log(`mongoDB connection established :)`);
    })
    .catch((err) => {
        console.log(`mongoDB Connection Error :(`);
        console.log(err);
    })

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 1; i <= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor((Math.random() * 20) + 10);
        const camp = new Campground({
            //BY DEFAULT THIS IS AVIKAL USER AUTHOR ID 
            author: '60a09edf57cf950d08244460',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dmaluloab/image/upload/v1622383183/YelpCamp/vmvnwsuiiqt6ywyxnofg.jpg",
                    filename: "YelpCamp/vmvnwsuiiqt6ywyxnofg"
                },
                {
                    url: "https://res.cloudinary.com/dmaluloab/image/upload/v1622383155/YelpCamp/gtnwstetrq0ycunihkyz.jpg",
                    filename: "YelpCamp/gtnwstetrq0ycunihkyz"
                },
                {
                    url: "https://res.cloudinary.com/dmaluloab/image/upload/v1622383243/YelpCamp/nnn8gxqcyyfmfvwz18lr.jpg",
                    filename: "YelpCamp/nnn8gxqcyyfmfvwz18lr"
                },
                {
                    url: "https://res.cloudinary.com/dmaluloab/image/upload/v1622383137/YelpCamp/qvaf36wk1ooyppnmcmxx.jpg",
                    filename: "YelpCamp/qvaf36wk1ooyppnmcmxx"
                }
            ],
            discription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log(`Connection Closed SuccessFully ;)`);
})