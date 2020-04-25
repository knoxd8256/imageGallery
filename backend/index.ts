// Imports.
import express from 'express';
import mongodb, { MongoError } from 'mongodb';

// Create application.
const app = express();
app.use(express.json());

// MongoDB Client.
const MongoClient = new mongodb.MongoClient('mongodb://localhost:27017', {useUnifiedTopology: true});
MongoClient.connect((error) => error ? console.log(error.message) : console.log("Successfully Connected to the Database!"));
const db = MongoClient.db('imageGallery');
const collection = db.collection('images');

function respond(content: any, response: express.Response<any>, code: number = 200) {
    response.status(code)
    response.send(content)
    return;
}


// Routes.
app.post('/getPosts', (req, res) => {
    // Filter to tags if there are any.
    const filter = req.body.tags ? {'tags': { $in: req.body.tags }} : {};
    // Return the results or handle any errors which are present.
    collection.find(filter).toArray((error, posts) => {
        if (error) {
            console.log(error.message);
            respond(error.message, res, 500);
        }
        else {
            respond(posts, res);
        }
    })
    return;
});

app.post('/addPost', (req, res) => {
    const content = req.body;
    if (typeof content.title != 'string') {
        respond("title must be a string.", res, 400);
        return;
    }
    if (typeof content.imageUrl != 'string') {
        respond("imageUrl must be a string.", res, 400);
        return;
    }
    if (typeof content.description != 'string') {
        respond("description must be a string.", res, 400);
        return;
    }
    if (typeof content.tags != 'object') {
        respond("tags must be an array.", res, 400);
        return;
    }
    collection.insertOne(content, (error, res) => {
        if (error) {
            console.log(error.message);
        }
        else {
            console.log("Successfully added post!");
        }
    });
    respond("Successfully added post!", res);
});
// Start API.
app.listen(9001);
