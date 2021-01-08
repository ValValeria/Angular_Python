import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-slider-component',
    templateUrl: './Slider.component.html',
    styleUrls: ['./Slider.component.scss']
})
export class Slider{
    @Input('urls') images: string[] = [];

    constructor(config: NgbCarouselConfig) {
        config.interval = 2000;
        config.wrap = true;
        config.keyboard = false;
        config.pauseOnHover = false;
    }  
}