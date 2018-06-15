import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pipeline } from '../../app/launcher/model/pipeline.model';
import { PipelineService } from '../../app/launcher/service/pipeline.service';

const MockPipeline = require('../../assets/mock/demo-pipeline.json');

@Injectable()
export class DemoPipelineService implements PipelineService {
  getPipelines(): Observable<Pipeline[]> {
    return Observable.of(MockPipeline);
  }
}
