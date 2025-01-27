import { Injectable } from "@angular/core";

@Injectable()
export class BaseUrl {
    private urlUserService: string = "http://localhost:8081/user/";
    getUrlUser(): string {
        return this.urlUserService;
    }

} 