import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrlService } from './baseUrl.service';
import { BehaviorSubject, lastValueFrom } from "rxjs";
@Injectable()
export class TestHistoryService{

    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient

    ){}
    async save(testHistory: any) : Promise<any>{
        return await lastValueFrom(this.httpClient.post(this.baseUrlService.getQuizBaseUrl()
        + 'testHistory/save', testHistory));
    }

}