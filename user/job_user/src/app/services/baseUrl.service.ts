import { Injectable } from "@angular/core";

@Injectable()
export class BaseUrl {
    private urlUserService: string = "http://localhost:8081/user/";
    private urlJobService: string = "http://localhost:8083/job/";
    getUrlUser(): string {
        return this.urlUserService;
    }

   
    getUrlJob(): string {
        return this.urlJobService;
    }

} 