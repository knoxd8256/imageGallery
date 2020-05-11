import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPost } from './IPost.model';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private _items: BehaviorSubject<IPost[]> = new BehaviorSubject([]);
  public readonly items$: Observable<IPost[]> = this._items.asObservable();

  constructor(private http: HttpClient) {
    this.getPosts();
  }

  public getPosts(tags: string = ""): void {
    this.http.post('http://localhost:9001/getPosts', {"tags": tags})
    .subscribe((response) => {
      this._items.next(response as IPost[]);
    });
  }

  public updatePost(post: IPost): any{
    this.http.post("http://localhost:9001/updatePost", post)
    .subscribe();
    this.getPosts();
  }

  public addPost(post: IPost): any{
    this.http.post("http://localhost:9001/addPost", post)
    .subscribe();
    this.getPosts();
  }

  public deletePost(postId: string) {
    this.http.post("http://localhost:9001/deletePost", {_id: postId})
    .subscribe();
    this.getPosts();
  }

  public parseTags(tags: string) {
    let tagArray = tags.split(',');
    let cleanTags = tagArray.map(el => el.trim().toLowerCase());
    return cleanTags;
  }
}
