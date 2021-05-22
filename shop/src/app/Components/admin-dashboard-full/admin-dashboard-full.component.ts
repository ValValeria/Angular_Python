import { Component } from '@angular/core';
import {Subject} from 'rxjs/internal/Subject';

@Component({
  selector: 'app-admin-dashboard-full',
  templateUrl: './admin-dashboard-full.component.html',
  styleUrls: ['./admin-dashboard-full.component.scss']
})
export class AdminDashboardFullComponent{
  public close$ = new Subject();

  constructor() { }

  close(): void{
    this.close$.next();
  }
}
