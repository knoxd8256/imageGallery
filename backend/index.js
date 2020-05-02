"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports.
var express_1 = __importDefault(require("express"));
var mongodb_1 = __importStar(require("mongodb"));
var cors_1 = __importDefault(require("cors"));
// Create application.
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
// MongoDB Client.
var MongoClient = new mongodb_1.default.MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
MongoClient.connect(function (error) { return error ? console.log(error.message) : console.log("Successfully Connected to the Database!"); });
var db = MongoClient.db('imageGallery');
var collection = db.collection('images');
// Response shorthand function.
function respond(content, response, code) {
    if (code === void 0) { code = 200; }
    response.status(code);
    response.header("Access-Control-Allow-Origin", "*");
    response.send(content);
    return;
}
// Post type checker.
function isPost(content, callback) {
    if (typeof content.title != 'string') {
        callback(false, 'title must be a string');
        return;
    }
    if (typeof content.imageUrl != 'string') {
        callback(false, "imageUrl must be a string.");
        return;
    }
    if (typeof content.description != 'string') {
        callback(false, "description must be a string.");
        return;
    }
    if (typeof content.tags != 'object') {
        callback(false, "tags must be an array.");
        return;
    }
    callback(true, 'This is a post.');
    return;
}
// Routes.
// Single getter route.
app.post('/getPost', function (req, res) {
    if (mongodb_1.default.ObjectId.isValid(req.body._id)) {
        collection.findOne({ _id: new mongodb_1.ObjectId(req.body._id) }, function (error, post) {
            if (error) {
                console.log(error.message);
                respond(error.message, res, 500);
            }
            else if (post) {
                respond(post, res);
            }
            else {
                respond("Post not found!", res, 400);
            }
        });
    }
    else {
        respond("ID invalid.", res, 400);
    }
});
// Post getter route.
app.post('/getPosts', function (req, res) {
    // Filter to tags if there are any.
    var filter = req.body.tags ? { 'tags': { $in: req.body.tags } } : {};
    // Return the results or handle any errors which are present.
    collection.find(filter).toArray(function (error, posts) {
        if (error) {
            console.log(error.message);
            respond({ message: error.message }, res, 500);
        }
        else {
            respond(posts, res);
        }
    });
    return;
});
// Post adder route.
app.post('/addPost', function (req, res) {
    var content = req.body;
    isPost(content, function (result, resText) {
        if (result === true) {
            collection.insertOne(content, function (error) {
                if (error) {
                    console.log(error.message);
                    respond({ message: "There was an error adding your post." }, res, 500);
                }
                else {
                    console.log("Successfully added post!");
                    respond({ message: "Successfully added post!" }, res);
                }
            });
            return;
        }
        respond({ message: resText }, res, 400);
        return;
    });
});
// Post deletion route.
app.post('/deletePost', function (req, res) {
    var rawPostId = req.body._id;
    var postId;
    if (mongodb_1.default.ObjectId.isValid(rawPostId)) {
        postId = new mongodb_1.default.ObjectId(rawPostId);
    }
    else {
        respond({ message: 'Invalid ID.' }, res, 400);
        return;
    }
    collection.findOneAndDelete({ _id: postId }, function (err, result) {
        if (err) {
            console.log(err.message);
            respond({ message: "Could not delete post." }, res, 500);
        }
        if (result.value == null) {
            respond({ message: "No such document found." }, res, 400);
        }
        else {
            respond({ message: "Deleted post!" }, res);
            return;
        }
    });
});
// Post update route.
app.post('/updatePost', function (req, res) {
    var content = req.body;
    isPost(content, function (result, resText) {
        if (mongodb_1.default.ObjectId.isValid(req.body._id) && result == true) {
            content._id = new mongodb_1.default.ObjectId(req.body._id);
            collection.replaceOne({ "_id": content._id }, content, function (err, result) {
                if (err) {
                    console.log(err.message);
                    respond({ message: "There was and error updating the document." }, res, 500);
                }
                else {
                    if (result.matchedCount == 0) {
                        respond({ message: "No such document found." }, res, 400);
                        return;
                    }
                    respond({ message: "Document successfully updated!" }, res);
                }
            });
        }
        else {
            respond(result ? { message: "Invalid Id." } : { message: resText }, res, 400);
        }
    });
});
// Start API.
app.listen(9001);
