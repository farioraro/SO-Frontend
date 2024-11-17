import {Component, OnInit} from '@angular/core';
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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchMessages();
  }

  fetchMessages() {
    this.http.get('http://localhost:3000/Messages')
      .subscribe({
        next: (data: any) => {
          this.messages = data;
        },
        error: (err) => console.error('Error al obtener mensajes:', err)
      });
  }
}
