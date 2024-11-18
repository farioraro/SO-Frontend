import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loggedUserId: string | null = null;
  showModal: boolean = false;
  messageContent: string = '';
  recipientId: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('loggedUserId');
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

  openMessagePopup(user: any): void {
    this.recipientId = user._id;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.messageContent = '';
  }

  sendMessage(): void {
    if (!this.messageContent.trim()) {
      alert('El mensaje no puede estar vacío.');
      return;
    }

    const newMessage = {
      senderId: this.loggedUserId,
      recipientId: this.recipientId,
      content: this.messageContent,
      sentDate: new Date(),
      readDate: null
    };

    this.http.post('http://localhost:3000/Messages', newMessage)
      .subscribe({
        next: () => {
          alert('Mensaje enviado con éxito');
          this.closeModal();
        },
        error: (err) => console.error('Error al enviar mensaje', err)
      });
  }
}
