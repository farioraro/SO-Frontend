import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  departments: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.http.get('http://localhost:3000/Departments')
      .subscribe({
        next: (data: any) => {
          this.departments = data;
        },
        error: (err) => console.error('Error al obtener departamentos:', err)
      });
  }
}
