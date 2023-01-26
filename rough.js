const mongoose = require('mongoose')
const Campground = require('../models/campgrounds')
const {places, descriptors} = require('./seedHelper')
const cities = require('./cities')
const axios = require('axios').default;

mongoose.connect('mongodb://localhost:27017/campingGrounds',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

async function seedImg(){
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random',{
            params:{
                client_id:'UxarpWwwV_Cd57n348X75xfMnw2dRE-b2eEwfth6rrk',
                collections: 1114848
            }
        })
        console.log(resp.data.urls.small)
        return resp.data.urls.small
    } catch(err) {
        console.error(err)
    } 
}
seedImg()

// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for(let i = 0; i<50;i++){

//         const random1000 = Math.floor(Math.random() * 1000);
//         const camp = new Campground({
//         location:`${cities[random1000].city}, ${cities[random1000].state} `,
//         title:`${sample(descriptors)}, ${sample(places)}`
//         })
//     await camp.save();
//     }



// }

// seedDB().then(() => {
//     mongoose.connection.close();
// })

