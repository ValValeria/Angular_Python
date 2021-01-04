import { Input } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-slider-component',
    templateUrl: './Slider.component.html'
})
export class Slider{
    @Input('urls') images: string[] = [];
}