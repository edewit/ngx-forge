import { Injectable } from '@angular/core';

import { Config } from '../../lib/service/config.component';

@Injectable()
export class HelperService  {

    private keys: any = {
        BACKEND: 'backend_url',
        ORIGIN: 'origin'
    };

    constructor(
        private config: Config
    ) {}

    getBackendUrl(): string {
        if (this.config) {
            return this.config.get(this.keys.BACKEND);
        }
        return null;
    }

    getOrigin(): string {
        if (this.config) {
            return this.config.get(this.keys.ORIGIN);
        }
        return null;
    }

}
