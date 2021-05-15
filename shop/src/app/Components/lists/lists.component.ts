import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  @Input() lists: string[];
  @Input() cssClass = 'h5';

  constructor() {
    this.lists = [];
  }

  ngOnInit(): void {
  }
}
