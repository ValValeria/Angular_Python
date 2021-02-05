import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-carousel',
    templateUrl: './Carousel.component.html'
})
export class Carousel implements OnInit {
    images = [];
    active = 0;

    ngOnInit(): void {
        this.images = [
           '/assets/slider1.jpg',
           '/assets/slider2.jpg'
        ];
    }

    prevImage(): void {
        if (this.active) {
            this.active -= 1;
        }
    }

    nextImage(): void {
        if (this.active < this.images.length - 1) {
            this.active += 1;
        }
    }
}
