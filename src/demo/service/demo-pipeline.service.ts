import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PipelineService } from '../../app/launcher/service/pipeline.service';
import { Pipeline } from '../../app/launcher/model/pipeline.model';

@Injectable()
export class DemoPipelineService implements PipelineService {

  constructor() {
  }
  getPipelines(): Observable<Pipeline[]> {
    let pipelines = Observable.of([
      {
        'pipelineId': 'Pipeline1',
        'suggested': true,
        'name': 'Name of Pipeline',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name', 'Stage Name', 'Stage Name']
      }, {
        'pipelineId': 'Pipeline2',
        'name': 'Name of Pipeline',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name']
      }, {
        'pipelineId': 'Pipeline3',
        'name': 'Name of Pipeline',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name', 'Stage Name', 'Stage Name']
      }, {
        'pipelineId': 'Pipeline4',
        'name': 'Name of Pipeline',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name', 'Stage Name']
      }] as Pipeline[]);
    return pipelines;
  }
}
