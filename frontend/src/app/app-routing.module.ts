import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { GalleryProperComponent } from './views/gallery-proper/gallery-proper.component';
import { CreatePostComponent } from './views/create-post/create-post.component';
import { UpdatePageComponent } from './views/update-page/update-page.component';


const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomePageComponent
  },
  {
    path: "gallery",
    pathMatch: "full",
    component: GalleryProperComponent
  },
  {
    path: "addPost",
    pathMatch: "full",
    component: CreatePostComponent
  },
  {
    path: "updatePost",
    pathMatch: "full",
    component: UpdatePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
