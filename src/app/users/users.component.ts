import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get('http://localhost:3000/Users')
      .subscribe({
        next: (data: any) => {
          this.users = data;
        },
        error: (err) => console.error('Error al obtener usuarios', err)
      });
  }
}
