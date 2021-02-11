import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-avatar',
    templateUrl: './Avatar.component.html'
})
export class Avatar{
    @Input() showAuthAvatar = false;
}