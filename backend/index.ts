// Imports.
import express from 'express';
import mongodb from 'mongodb';

// Create application.
const app = express();
app.use(express.json());

// MongoDB Client.
const MongoClient = new mongodb.MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
MongoClient.connect((error) => error ? console.log(error.message) : console.log("Successfully Connected to the Database!"));
const db = MongoClient.db('imageGallery');
const collection = db.collection('images');

// Response shorthand function.
function respond(content: any, response: express.Response<any>, code: number = 200) {
    response.status(code)
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

// Post getter route.
app.post('/getPosts', (req, res) => {
    // Filter to tags if there are any.
    const filter = req.body.tags ? { 'tags': { $in: req.body.tags } } : {};
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

// Post adder route.
app.post('/addPost', (req, res) => {
    const content = req.body as Post;
    isPost(content, (result, resText) => {
        if (result === true) {
            collection.insertOne(content, (error) => {
                if (error) {
                    console.log(error.message);
                    respond("There was an error adding your post.", res, 500)
                }
                else {
                    console.log("Successfully added post!");
                    respond("Successfully added post!", res);
                }
            });
            return;
        }
        respond(resText, res, 400);
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
        respond('Invalid ID.', res, 400);
        return;
    }
    collection.findOneAndDelete({_id: postId}, (err, result) => {
        if (err) {
            console.log(err.message);
            respond("Could not delete post.", res, 500);
        }
        if (result.value == null) {
            respond("No such document found.", res, 400)
        } else {
            respond("Deleted post!", res)
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
                respond("There was and error updating the document.", res, 500);
            } else {
                if (result.matchedCount == 0) {
                    respond("No such document found.", res, 400);
                    return;
                }
                respond("Document successfully updated!", res);
            }
        })
    } else {
        respond(result ? "Invalid Id." : resText, res, 400);
    }
});
});

// Start API.
app.listen(9001);
