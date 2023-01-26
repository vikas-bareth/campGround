const mongoose = require('mongoose')
const Campground = require('../models/campgrounds')
const {places, descriptors} = require('./seedHelper')
const cities = require('./cities')
const axios = require('axios');

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


const seedImg = async() => {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random',{
            params:{
                client_id:'UxarpWwwV_Cd57n348X75xfMnw2dRE-b2eEwfth6rrk',
                collections: 1114848
            }
        })
        return resp.data.urls.regular
    } catch(err) {
        console.error(err)
    } 
}



const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i<49;i++){

        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(10 + Math.random()* 20)
        const camp = new Campground({
            imageUrl: await seedImg(),
        location:`${cities[random1000].city}, ${cities[random1000].state} `,
        title:`${sample(descriptors)}, ${sample(places)}`,
         description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
        price:randomPrice,
        })
        
    await camp.save();
    }



}

seedDB().then(() => {
    mongoose.connection.close();
})

