import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { BaseUrl } from './baseUrl.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(
    private http: HttpClient,
    private baseUrl: BaseUrl,

  ) {}

   async findAll(): Promise<any> {
          return await lastValueFrom(this.http.get(this.baseUrl.getUrlJob()
          + 'findAll'));
      }

    async findById(id: number): Promise<any> {
        return await lastValueFrom(this.http.get(this.baseUrl.getUrlJob()
        + 'findById/' + id));
    }

  
}