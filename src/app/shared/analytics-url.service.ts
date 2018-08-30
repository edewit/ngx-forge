import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AnalyticsUrlService {

    getRecommenderAPIUrl(): string {
      return environment.ANALYTICS_RECOMMENDER_URL || '';
    }

    getLicenseAPIUrl(): string {
      return environment.ANALYTICS_LICENSE_URL || '';
    }

}
