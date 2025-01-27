import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:8083/job/'; // Thay bằng API endpoint của bạn

  constructor(private http: HttpClient) {}

   async findAll(): Promise<any> {
          return await lastValueFrom(this.http.get(this.apiUrl
          + 'findAll'));
      }
  
}