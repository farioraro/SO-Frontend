import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  departments: any[] = [];
  showModal: boolean = false;
  newDepartment: { name: string; location: string } = { name: '', location: '' };

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

  openAddDepartmentModal(): void {
    this.showModal = true;
  }

  closeAddDepartmentModal(): void {
    this.showModal = false;
    this.newDepartment = { name: '', location: '' };
  }

  addDepartment(): void {
    if (!this.newDepartment.name.trim() || !this.newDepartment.location.trim()) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    this.http.post('http://localhost:3000/Departments', this.newDepartment)
      .subscribe({
        next: (data: any) => {
          alert('Departamento agregado con éxito');
          this.departments.push(data); // Agregar el nuevo departamento a la lista local
          this.closeAddDepartmentModal();
        },
        error: (err) => console.error('Error al agregar el departamento:', err)
      });
  }

  deleteDepartment(department: any): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar el departamento "${department.name}"?`)) {
      return;
    }

    this.http.delete(`http://localhost:3000/Departments/${department._id}`)
      .subscribe({
        next: () => {
          alert('Departamento eliminado con éxito');
          this.departments = this.departments.filter(d => d._id !== department._id); // Eliminarlo de la lista local
        },
        error: (err) => console.error('Error al eliminar el departamento:', err)
      });
  }
}
