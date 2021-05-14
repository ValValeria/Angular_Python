import {NgModule} from '@angular/core';
import {GridLayoutComponent} from './GridLayout.component';
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [GridLayoutComponent],
    imports: [
        CommonModule
    ],
    exports: [GridLayoutComponent]
})
export class GridLayoutModule{}
