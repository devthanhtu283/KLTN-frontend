import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/models/user.model";
import { ChatService } from "src/app/services/chatBot.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'employer-root',
    templateUrl: "./employer.root.html",
  
  })
export class EmployerRoot implements OnInit{
    ngOnInit(): void {
        
    }
}