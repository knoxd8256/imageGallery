import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/core/IPost.model';
import { PostServiceService } from 'src/app/core/post-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gallery-proper',
  templateUrl: './gallery-proper.component.html',
  styleUrls: ['./gallery-proper.component.css']
})
export class GalleryProperComponent implements OnInit {
  posts: IPost[];
  searchForm = new FormGroup({
    searchBar: new FormControl('')
  });
  
  onSearch() {
    this.router.navigate(["/gallery"], {queryParams: {tags: this.postService.parseTags(this.searchForm.controls.searchBar.value)}})
  }

  constructor(public postService: PostServiceService, public route: ActivatedRoute, public router: Router) {
    this.getPosts()
    route.queryParamMap.subscribe(params => {
        let tags = params.getAll('tags');
        this.filterByTags(tags);
    })
  }

  getPosts() {
    this.postService.items$.subscribe(x => this.posts = x)
  }

  filterByTags(tags) {
    if (tags.length == 0 || tags[0] == '') {
      this.postService.getPosts();
      this.getPosts();
      return;
    }
    this.postService.getPosts(tags);
    this.getPosts();
    //if (tags.length == 0 || tags[0] == ''){
    //  return this.posts;
    //}
    //let result: IPost[] = [];
    //tags.forEach(tag => {
    //  this.posts.forEach((post) => {
    //    if (post.tags.includes(tag) && result.includes(post) == false) {
    //      result.push(post);
    //    }
    //  }
    //  )
    //});
    //return result;
  }
  ngOnInit(): void {
  }

}
