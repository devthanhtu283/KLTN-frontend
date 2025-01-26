import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { ChatService } from './services/chatBot.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    ngOnInit(): void {
        
    }
    getRole(): string {
      return 'employer';
    }
}