import { ThrowStmt } from "@angular/compiler";
import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './BreadCrumbs.component.html',
    styleUrls: ['./BreadCrumbs.component.scss']
})
export class BreadCrumbs {
    @Input() urls: [string, string][] = [];

    constructor(private router: Router) { }

    isActivePage(url: string): boolean {
        const isActive = this.router.isActive(url, true);
        return isActive;
    }
}