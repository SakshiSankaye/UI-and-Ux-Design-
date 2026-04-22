const cloudinary = require("cloudinary").v2

cloudinary.config({
cloud_name:"YOUR_NAME",
api_key:"YOUR_KEY",
api_secret:"YOUR_SECRET"
})

module.exports = cloudinary