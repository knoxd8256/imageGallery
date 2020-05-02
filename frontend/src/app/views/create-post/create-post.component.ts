import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostServiceService } from 'src/app/core/post-service.service';
import { Router } from '@angular/router';
import { IPost } from 'src/app/core/IPost.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  postForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
    tags: new FormControl('', Validators.required),
  })
  constructor(public postService: PostServiceService, public outlet: Router) {
  }

  public submitFunction() {
    if (this.postForm.invalid) {
      console.log("Please add more content.")
      return;
    }
    let resMessage;
    let formValues = this.postForm.value;
    formValues.tags = this.postService.parseTags(formValues.tags);
    let newPost = formValues as IPost;
    try {
      this.postService.addPost(newPost);
      resMessage = "Post added!";
    }
    catch(error) {
      resMessage = "Error adding the post."
      console.log(error);
    }
    finally {
      console.log(resMessage);
      this.outlet.navigate(["/gallery"]);
    }
  }
  ngOnInit(): void {
  }

}
