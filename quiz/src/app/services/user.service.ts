import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrlService } from './baseUrl.service';
import { BehaviorSubject, lastValueFrom } from "rxjs";
@Injectable()
export class UserService{

    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient

    ){}

    async login(user: any) : Promise<any>{
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getBaseUrl()
        + 'user/login', user));
    }
}