import { Component, OnInit, Input } from '@angular/core';
import { IPost } from 'src/app/core/IPost.model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input("post") post: IPost;

  isModal: boolean;

  modal() {
    this.isModal = !this.isModal;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
