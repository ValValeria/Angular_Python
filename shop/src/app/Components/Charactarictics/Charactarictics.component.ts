import { Component, Input } from "@angular/core";

@Component({
    selector:"charactarictics",
    templateUrl:"./Charactarictics.component.html",
    styleUrls:["./Charactarictics.component.scss"]
})
export class Charactarictics{
    @Input("data") data:[string,string][];
}