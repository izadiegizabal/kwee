import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-admin-manage-candidates',
  templateUrl: './admin-manage-candidates.component.html',
  styleUrls: ['./admin-manage-candidates.component.scss']
})
export class AdminManageCandidatesComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Manage Candidates');
  }

}
