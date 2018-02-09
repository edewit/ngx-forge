import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TargetEnvironment } from '../../app/launcher/launcher.module';
import { TargetEnvironmentService } from '../../app/launcher/launcher.module';

@Injectable()
export class DemoTargetEnvironmentService implements TargetEnvironmentService {
  /**
   * Returns target environments
   *
   * @returns {Observable<TargetEnvironment>} The target environments
   */
  getTargetEnvironments(): Observable<TargetEnvironment[]> {
    return Observable.of([{
      description: 'Here is a brief description of what OpenShift Online is. ' +
                   'There is a distinction between what OpenShift Online does compared to OpenShift.io.',
      benefits: [
        'In your GitHub namespace, create repository containg your project\'s code.',
        'Configure OpenShift Online to build and deploy your code on each push to your repository\'s master branch.',
        'Here is a benefit of using OpenShift as a project environment.'
      ],
      footer: 'OpenShift',
      header: 'Code Locally, Build and Deploy Online',
      icon: '/assets/images/Logotype_RH_OpenShiftOnline_wLogo_RGB_Black.svg',
      id: 'os'
    }, {
      description: 'When you build and run locally, you will receive a .zip file ' +
                   'containing the setup you have established for your application.',
      benefits: [
        'Scaffold a project based on your chosen runtime.',
        'Configure OpenShift Online to build and deploy your code on each push to your repository\'s master branch.',
        'Here is a benefit of using OpenShift as a project environment.'
      ],
      footer: '.ZIP File',
      header: 'Build &amp; Run Locally',
      icon: '/assets/images/file-archive-o.svg',
      id: 'zip',
      styleClass: 'card-pf-footer--logo-zip'
    }] as TargetEnvironment[]);
  }
}
