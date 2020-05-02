// Imports.
import express from 'express';
import mongodb, { ObjectId } from 'mongodb';
import cors from 'cors';

// Create application.
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Client.
const MongoClient = new mongodb.MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
MongoClient.connect((error) => error ? console.log(error.message) : console.log("Successfully Connected to the Database!"));
const db = MongoClient.db('imageGallery');
const collection = db.collection('images');

// Response shorthand function.
function respond(content: any, response: express.Response<any>, code: number = 200) {
    response.status(code)
    response.header("Access-Control-Allow-Origin", "*");
    response.send(content)
    return;
}

// Post interfaces.
interface PostCallback {
    (errorPresent: Boolean, resolutionText: String): void
}

interface Post {
    _id?: string | mongodb.ObjectId,
    title: string,
    imageUrl: string,
    description: string,
    tags: Array<string>
}

// Post type checker.
function isPost(content: Post, callback: PostCallback): void {
    if (typeof content.title != 'string') {
        callback(false, 'title must be a string')
        return;
    }
    if (typeof content.imageUrl != 'string') {
        callback(false, "imageUrl must be a string.")
        return;
    }
    if (typeof content.description != 'string') {
        callback(false, "description must be a string.")
        return;
    }
    if (typeof content.tags != 'object') {
        callback(false, "tags must be an array.")
        return;
    }
    callback(true, 'This is a post.');
    return;
}


// Routes.

// Single getter route.
app.post('/getPost', (req, res) => {
    if (mongodb.ObjectId.isValid(req.body._id)) {
        collection.findOne({_id: new ObjectId(req.body._id)}, (error, post) => {
            if (error) {
                console.log(error.message);
                respond(error.message, res, 500);
            }
            else if (post) {
                respond(post, res);
            }
            else {
                respond("Post not found!", res, 400)
            }
        });
    }
    else {
        respond("ID invalid.", res, 400)
    }
});

// Post getter route.
app.post('/getPosts', (req, res) => {
    // Filter to tags if there are any.
    const filter = req.body.tags ? { 'tags': { $in: req.body.tags } } : {};
    // Return the results or handle any errors which are present.
    collection.find(filter).toArray((error, posts) => {
        if (error) {
            console.log(error.message);
            respond({message: error.message}, res, 500);
        }
        else {
            respond(posts, res);
        }
    })
    return;
});

// Post adder route.
app.post('/addPost', (req, res) => {
    const content = req.body as Post;
    isPost(content, (result, resText) => {
        if (result === true) {
            collection.insertOne(content, (error) => {
                if (error) {
                    console.log(error.message);
                    respond({message: "There was an error adding your post."}, res, 500)
                }
                else {
                    console.log("Successfully added post!");
                    respond({message: "Successfully added post!"}, res);
                }
            });
            return;
        }
        respond({message: resText}, res, 400);
        return;
    });
});

// Post deletion route.
app.post('/deletePost', (req, res) => {
    const rawPostId = req.body._id;
    let postId: mongodb.ObjectId;
    if (mongodb.ObjectId.isValid(rawPostId)) {
        postId = new mongodb.ObjectId(rawPostId);
    } else {
        respond({message: 'Invalid ID.'}, res, 400);
        return;
    }
    collection.findOneAndDelete({_id: postId}, (err, result) => {
        if (err) {
            console.log(err.message);
            respond({message: "Could not delete post."}, res, 500);
        }
        if (result.value == null) {
            respond({message: "No such document found."}, res, 400)
        } else {
            respond({message: "Deleted post!"}, res)
            return;
        }
    });
});

// Post update route.
app.post('/updatePost', (req, res) => {
    const content = req.body as Post;
    isPost(content, (result, resText) => {
    if (mongodb.ObjectId.isValid(req.body._id) && result == true) {
        content._id = new mongodb.ObjectId(req.body._id);
        collection.replaceOne({"_id": content._id}, content, (err, result) => {
            if (err) {
                console.log(err.message);
                respond({message: "There was and error updating the document."}, res, 500);
            } else {
                if (result.matchedCount == 0) {
                    respond({message: "No such document found."}, res, 400);
                    return;
                }
                respond({message: "Document successfully updated!"}, res);
            }
        })
    } else {
        respond(result ? {message: "Invalid Id."} : {message: resText}, res, 400);
    }
});
});

// Start API.
app.listen(9001);
