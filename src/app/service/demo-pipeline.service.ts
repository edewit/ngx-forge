import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pipeline } from '../../../projects/ngx-launcher/src/lib/model/pipeline.model';
import { PipelineService } from '../../../projects/ngx-launcher/src/lib/service/pipeline.service';


const MockPipeline = require('../mock/demo-pipeline.json');

@Injectable()
export class DemoPipelineService implements PipelineService {
  getPipelines(): Observable<Pipeline[]> {
    return of(MockPipeline);
  }
}
