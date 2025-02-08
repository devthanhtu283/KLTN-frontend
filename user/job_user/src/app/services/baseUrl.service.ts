import { Injectable } from "@angular/core";

@Injectable()
export class BaseUrl {
    private urlUserService: string = "http://localhost:8080/user/";
    private urlJobService: string = "http://localhost:8080/job/";
    private urlApplicationService: string = "http://localhost:8080/application/";
    private jobImageUrl: string=  "http://localhost:8080/job-static/assets/images/";
    private locationUrl: string = "https://provinces.open-api.vn/api";
    getUrlUser(): string {
        return this.urlUserService;
    }

   
    getUrlJob(): string {
        return this.urlJobService;
    }

    getUrlApplication(): string {
        return this.urlApplicationService;
    }

    getJobImageUrl(): string{
        return this.jobImageUrl;
    }

    getLocationUrl(): string {
        return this.locationUrl;
    }

} 