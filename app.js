require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const mongoose = require('mongoose');
const Link = require('./models/image');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/celebal');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'celebal',
    allowedFormats:['jpeg','png','jpg'],
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname,
  },
});


const upload=multer({storage})

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
      const images = await Link.find({});
      res.render('index', { images });
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).send('Error fetching images');
    }
  });

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const newImage = new Link({
        imageUrl: req.file.path,
        filename: req.file.filename
      });
      
      const savedImage = await newImage.save();
      
      res.redirect(`/upload/${savedImage._id}`);
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).send('Error saving image');
    }
  });
  
  app.get('/upload/:id', async (req, res) => {
    try {
      const image = await Link.findById(req.params.id);
  
      if (!image) {
        return res.status(404).send('Image not found');
      }
  
      res.render('result', { image: image.imageUrl });
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Error fetching image');
    }
  });
  
  
  

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('.env file require with cloudnary ')
});
