import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Pipeline } from '../../app/launcher/model/pipeline.model';
import { PipelineService } from '../../app/launcher/service/pipeline.service';

import { HelperService } from '../../app/launcher/service/helper.service';
import { TokenProvider } from '../../app/service/token-provider';

@Injectable()
export class DemoPipelineService implements PipelineService {
  getPipelines(): Observable<Pipeline[]> {
    let pipelines = Observable.of([{
      'id': 'maven-release',
      'platform': 'maven',
      'name': 'Release',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }],
      'suggested': false,
      'techpreview': false
    }, {
      'id': 'maven-releaseandstage',
      'platform': 'maven',
      'name': 'Release and Stage',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }, {
        'name': 'Rollout to Stage',
        'description': 'Stages the new version into the **Stage** environment'
      }],
      'suggested': false,
      'techpreview': false
    }, {
      'id': 'maven-releasestageapproveandpromote',
      'platform': 'maven',
      'name': 'Release, Stage, Approve and Promote',
      'stages': [{
        'name': 'Build Release',
        'description': 'Creates a new version then builds and deploys the project into the maven repository'
      }, {
        'name': 'Integration Test',
        'description': 'Runs an integration test in the **Test** environment'
      }, {
        'name': 'Rollout to Stage',
        'description': 'Stages the new version into the **Stage** environment'
      }, {
        'name': 'Approve',
        'description': 'Waits for **Approval** to promote'
      }, {
        'name': 'Rollout to Run',
        'description': 'Promotes to the **Run** environment'
      }],
      'suggested': true,
      'techpreview': false
    }] as Pipeline[]);
    return pipelines;
  }
}
