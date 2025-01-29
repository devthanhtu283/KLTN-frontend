import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { BaseUrl } from './baseUrl.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(
    private httpClient: HttpClient,
    private baseUrl: BaseUrl,

  ) {}

   async findByEmployerId(employerId: number, currentPage: number, status: number): Promise<any> {
          return await lastValueFrom(this.httpClient.get(`${this.baseUrl.getUrlApplication()}list-seeker?employerId=${employerId}&page=${currentPage}&status=${status}`));
    }

    async updateStatus(application: any): Promise<any> {
        return await lastValueFrom(this.httpClient.put(this.baseUrl.getUrlApplication()
        + 'update', application));
    }

    async findById(applicationId: number): Promise<any> {
      return await lastValueFrom(this.httpClient.get(this.baseUrl.getUrlApplication()
      + 'findById/' + applicationId));
    }
  
}