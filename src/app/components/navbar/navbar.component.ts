import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Students',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/'],
      },
      {
        label: 'Courses',
        icon: 'pi pi-fw pi-file',
        routerLink: ['/courses'],
      },
    ];
  }
}
