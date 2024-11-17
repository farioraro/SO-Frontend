import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    this.http.post('http://localhost:3000/Users/login', { email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => alert('Credenciales incorrectas'),
      });
  }
}
