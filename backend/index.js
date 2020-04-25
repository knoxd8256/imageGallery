"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports.
var express_1 = __importDefault(require("express"));
var mongodb_1 = __importDefault(require("mongodb"));
// Create application.
var app = express_1.default();
app.use(express_1.default.json());
// MongoDB Client.
var MongoClient = new mongodb_1.default.MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
MongoClient.connect(function (error) { return error ? console.log(error.message) : console.log("Successfully Connected to the Database!"); });
var db = MongoClient.db('imageGallery');
var collection = db.collection('images');
function respond(content, response, code) {
    if (code === void 0) { code = 200; }
    response.status(code);
    response.send(content);
    return;
}
// Routes.
app.post('/getPosts', function (req, res) {
    // Filter to tags if there are any.
    var filter = req.body.tags ? { 'tags': { $in: req.body.tags } } : {};
    // Return the results or handle any errors which are present.
    collection.find(filter).toArray(function (error, posts) {
        if (error) {
            console.log(error.message);
            respond(error.message, res, 500);
        }
        else {
            respond(posts, res);
        }
    });
    return;
});
app.post('/addPost', function (req, res) {
    var content = req.body;
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
    collection.insertOne(content, function (error, res) {
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
