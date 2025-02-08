import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { BaseUrl } from './baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient, private baseUrl: BaseUrl) {}

  async findAll(): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'findAll')
    );
  }
  findAllPagination(page: number): Observable<any> {
    return this.http.get(
      this.baseUrl.getUrlJob() + 'findAllPagination?page=' + page
    );
  }
  async findById(id: number): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'findById/' + id)
    );
  }
  async locationFindAll(): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'location/findAll')
    );
  }
  async experienceFindAll(): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'experience/findAll')
    );
  }
  async worktypeFindAll(): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'worktype/findAll')
    );
  }
  searchJobs(
    title?: string,
    locationId?: number,
    worktypeId?: number,
    experienceId?: number,
    page: number = 1,
    size: number = 6
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (title) {
      params = params.set('title', title);
    }
    if (locationId) {
      params = params.set('locationId', locationId.toString());
    }
    if (worktypeId) {
      params = params.set('worktypeId', worktypeId.toString());
    }
    if (experienceId) {
      params = params.set('experienceId', experienceId.toString());
    }

    return this.http.get(this.baseUrl.getUrlJob() + 'searchJobs', { params });
  }
  async skillFindAll(): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'skill/findAll')
    );
  }
  async favoriteFindBySeekerIdPagination(seekerId: number, page: number): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'favorite/findBySeekerIdPagination/' + seekerId + '?page=' + page)
    );
  }
  async favoriteCreate(favorite: any): Promise<any> {
    return await lastValueFrom(
      this.http.post(this.baseUrl.getUrlJob() + 'favorite/create', favorite)
    );
  }
  async favoriteCheckExists(jobId: number, seekerId: number): Promise<any> {
    return lastValueFrom(this.http.get(
      this.baseUrl.getUrlJob() + 'favorite/checkExists/' + jobId + '/' + seekerId
    ));
  }
  async feedbackCreate(feedback: any): Promise<any> {
    return await lastValueFrom(
      this.http.post(this.baseUrl.getUrlJob() + 'feedback/create', feedback)
    );  
  }
  async findByEmployerIdPagination(employerId: number, page: number): Promise<any> {
    return await lastValueFrom(
      this.http.get(this.baseUrl.getUrlJob() + 'findByEmployerIdPagination/' + employerId + '?page=' + page)
    );
  }
  async create(job: any): Promise<any> {
    return await lastValueFrom(
      this.http.post(this.baseUrl.getUrlJob() + 'create', job)
    );  
  }
  async delete(jobId: number): Promise<any> {
    return await lastValueFrom(
      this.http.put(this.baseUrl.getUrlJob() + 'delete/' + jobId, null)
    );  
  }
}
