import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];
  allMessages: any[] = [];
  users: any[] = [];
  loggedUserId: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loggedUserId = localStorage.getItem('loggedUserId');
    console.log('ID del usuario logeado:', this.loggedUserId); // Verificación
    this.fetchUsersAndMessages();
  }

  fetchUsersAndMessages(): void {
    // Obtener usuarios
    this.http.get('http://localhost:3000/Users')
      .subscribe({
        next: (users: any) => {
          this.users = users;

          // Después de obtener los usuarios, obtener los mensajes
          this.fetchMessages();
        },
        error: (err) => console.error('Error al obtener usuarios:', err)
      });
  }

  fetchMessages(): void {
    this.http.get('http://localhost:3000/Messages')
      .subscribe({
        next: (messages: any) => {

          // Asociar cada mensaje con el email del sender y el recipient
          this.allMessages = messages.map((message: any) => {
            const sender = this.users.find(user => user._id === message.senderId);
            const recipient = this.users.find(user => user._id === message.recipientId);

            return {
              ...message,
              senderEmail: sender ? sender.email : 'Desconocido',
              recipientEmail: recipient ? recipient.email : 'Desconocido'
            };
          });

          console.log('Todos los mensajes:', this.allMessages); // Verifica los mensajes completos

          // Filtrar los mensajes donde el usuario es el remitente o el destinatario
          this.messages = this.allMessages.filter(
            message => String(message.senderId) === String(this.loggedUserId) || String(message.recipientId) === String(this.loggedUserId)
          );

          console.log('Mensajes filtrados:', this.messages); // Verifica los mensajes filtrados
        },
        error: (err) => console.error('Error al obtener mensajes:', err)
      });
  }

  showAllMessages(): void {
    this.messages = [...this.allMessages];
    console.log('Mostrando todos los mensajes:', this.messages); // Muestra todos los mensajes del usuario
  }

  showReceivedMessages(): void {
    this.messages = this.allMessages.filter(
      message => String(message.recipientId) === String(this.loggedUserId)
    );
  }

  showSentMessages(): void {
    this.messages = this.allMessages.filter(
      message => String(message.senderId) === String(this.loggedUserId)
    );
  }

  markAsRead(message: any): void {
    const updatedMessage = {
      ...message,
      readDate: new Date().toISOString() // Actualizar con la fecha actual
    };

    this.http.patch(`http://localhost:3000/Messages/${message._id}`, { readDate: updatedMessage.readDate })
      .subscribe({
        next: () => {
          console.log(`Mensaje ${message._id} marcado como leído.`);
          // Actualizar el mensaje en la lista actual
          message.readDate = updatedMessage.readDate;
        },
        error: (err) => console.error('Error al marcar el mensaje como leído:', err)
      });
  }

  deleteMessage(message: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      this.http.delete(`http://localhost:3000/Messages/${message._id}`)
        .subscribe({
          next: () => {
            console.log(`Mensaje ${message._id} eliminado.`);
            // Eliminar el mensaje de la lista local
            this.messages = this.messages.filter(m => m._id !== message._id);
            this.allMessages = this.allMessages.filter(m => m._id !== message._id);
          },
          error: (err) => console.error('Error al eliminar el mensaje:', err)
        });
    }
  }
}
