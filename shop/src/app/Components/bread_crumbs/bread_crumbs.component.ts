import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './bread_crumbs.component.html',
    styleUrls: ['./bread_crumbs.component.scss']
})
export class BreadCrumbsComponent {
    @Input() urls: [string, string][] = [];

    constructor(private router: Router) { }

    isActivePage(url: string): boolean {
        const isActive = this.router.isActive(url, true);
        return isActive;
    }
}
