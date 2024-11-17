import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { MessagesComponent } from './messages/messages.component';
import { DepartmentsComponent } from './departments/departments.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, children: [
      { path: 'users', component: UsersComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
