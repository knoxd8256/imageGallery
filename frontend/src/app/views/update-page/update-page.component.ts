import { Component, OnInit } from '@angular/core';
import { PostServiceService } from 'src/app/core/post-service.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IPost } from 'src/app/core/IPost.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-page',
  templateUrl: './update-page.component.html',
  styleUrls: ['./update-page.component.css']
})
export class UpdatePageComponent implements OnInit {
  post: IPost
  postId: string
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    imageUrl: new FormControl(''),
    tags: new FormControl(''),
  })

  constructor(public postService: PostServiceService, router: ActivatedRoute, public outlet: Router) {
    router.queryParamMap.subscribe((observer) => {
      this.postId = observer.get("_id")
    });
  }

  private getPost() {
    this.postService.items$.subscribe(response => {
    if (response.length != 0) {
      this.post = response.find(entry => entry._id == this.postId)
      this.postForm.controls.title.setValue(this.post.title)
      this.postForm.controls.description.setValue(this.post.description)
      this.postForm.controls.imageUrl.setValue(this.post.imageUrl)
      this.postForm.controls.tags.setValue(this.post.tags.toString())
    }
  });
  }

  public submitFunction() {
    let resMessage;
    let formValues = this.postForm.value;
    formValues._id = this.postId;
    formValues.tags = this.postService.parseTags(formValues.tags);
    let newPost = formValues as IPost;
    try {
      this.postService.updatePost(newPost);
      resMessage = "Updated Post!"
    }
    catch(error) {
      resMessage = "Error updating the post."
      console.log(error)
    }
    finally {
      console.log(resMessage)
      this.getPost()
      this.outlet.navigate(["/gallery"])
    }
  }

  deletePost(){
    this.postService.deletePost(this.postId)
    this.outlet.navigate(["/gallery"])
  }

  ngOnInit(): void {
    this.getPost()
  }

}
