import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryProperComponent } from './gallery-proper.component';

describe('GalleryProperComponent', () => {
  let component: GalleryProperComponent;
  let fixture: ComponentFixture<GalleryProperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryProperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryProperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
