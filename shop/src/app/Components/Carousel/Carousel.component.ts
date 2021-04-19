import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: './Carousel.component.html'
})
// tslint:disable-next-line:component-class-suffix
export class Carousel{
    @Input() images: string[] = [];
    active = 0;

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
