import { Injectable, InjectionToken } from '@angular/core';

@Injectable()
export class AuthHelperService  {

    AUTH_API_URL: InjectionToken<String>;
    constructor() {}

    getAuthApiURl(): InjectionToken<String> {
        return this.AUTH_API_URL;
    }
}
