import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './views/home-page/home-page.component';
import { GalleryProperComponent } from './views/gallery-proper/gallery-proper.component';
import { CreatePostComponent } from './views/create-post/create-post.component';
import { UpdatePageComponent } from './views/update-page/update-page.component';
import { PostCardComponent } from './shared/post-card/post-card.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    GalleryProperComponent,
    CreatePostComponent,
    UpdatePageComponent,
    PostCardComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
