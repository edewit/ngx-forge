import { Pipeline } from '../../model/pipeline.model';
import { PipelineService } from '../../service/pipeline.service';
import { Observable, of } from 'rxjs';

export class StubbedPipelineService implements PipelineService {
  getPipelines(filterByRuntime?: string): Observable<Pipeline[]> {
    return of(pipelines());
  }
}

export const mavenReleasePipeline: Pipeline = {
  'id': 'maven-release',
  'platform': 'maven',
  'name': 'Release',
  'description': 'Maven based pipeline which:\n\n' +
    '* creates a new version then builds and deploys the project into the maven repository',
  'stages': [{
    'name': 'Build Release',
    'description': 'creates a new version then builds and deploys the project into the maven repository'
  }],
  'suggested': false,
  'techPreview': false
};

/**
 * Data based on https://github.com/fabric8io/fabric8-jenkinsfile-library
 */
export function pipelines(): Pipeline[] {

  return [{
    'id': 'django-releaseandstage',
    'platform': 'django',
    'name': 'Release and Stage',
    'description': 'Django based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'django-releasestageapproveandpromote',
    'platform': 'django',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'Django based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }, {
    'id': 'dotnet-releaseandstage',
    'platform': 'dotnet',
    'name': 'Release and Stage',
    'description': 'dotnet based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'dotnet-releasestageapproveandpromote',
    'platform': 'dotnet',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'dotnet based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }, {
    'id': 'golang-releaseandstage',
    'platform': 'golang',
    'name': 'Release and Stage',
    'description': 'Golang based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'golang-releasestageapproveandpromote',
    'platform': 'golang',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'Golang based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }, mavenReleasePipeline, {
    'id': 'maven-releaseandstage',
    'platform': 'maven',
    'name': 'Release and Stage',
    'description': 'Maven based pipeline which:\n\n' +
      '* creates a new version then builds and deploys the project into the maven repository\n' +
      '* stages the new version into the **Stage** environment',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'maven-releasestageapproveandpromote',
    'platform': 'maven',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'Maven based pipeline which:\n\n' +
      '* creates a new version then builds and deploys the project into the maven repository\n' +
      '* stages the new version into the **Stage** environment\n' +
      '* waits for **Approval** to promote \n' +
      '* promotes to the **Run** environment',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }, {
    'id': 'node-releaseandstage',
    'platform': 'node',
    'name': 'Release and Stage',
    'description': 'NodeJS based pipeline which creates a new version then builds and deploys the project ' +
      'into the Nexus repository',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'node-releasestageapproveandpromote',
    'platform': 'node',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'NodeJS based pipeline which creates a new version then builds and deploys the project ' +
      'into the Nexus repository',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }, {
    'id': 'php-releaseandstage',
    'platform': 'php',
    'name': 'Release and Stage',
    'description': 'PHP apache based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'php-releasestageapproveandpromote',
    'platform': 'php',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'PHP apache based pipeline which creates a new version then builds and deploys the project',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }, {
    'id': 'rails-releaseandstage',
    'platform': 'rails',
    'name': 'Release and Stage',
    'description': 'Ruby on Rails based pipeline which creates a new version then builds and deploys the project ' +
      'into the Nexus repository',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'rails-releasestageapproveandpromote',
    'platform': 'rails',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'Ruby on Rails based pipeline which creates a new version then builds and deploys the project ' +
      'into the Nexus repository',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }, {
    'id': 'swift-releaseandstage',
    'platform': 'swift',
    'name': 'Release and Stage',
    'description': 'NodeJS based pipeline which creates a new version then builds and deploys the project ' +
      'into the Nexus repository',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {'name': 'Rollout to Stage', 'description': 'stages the new version into the Stage environment'}],
    'suggested': false,
    'techPreview': false
  }, {
    'id': 'swift-releasestageapproveandpromote',
    'platform': 'swift',
    'name': 'Release, Stage, Approve and Promote',
    'description': 'NodeJS based pipeline which creates a new version then builds and deploys the project ' +
      'into the Nexus repository',
    'stages': [{
      'name': 'Build Release',
      'description': 'creates a new version then builds and deploys the project into the maven repository'
    }, {
      'name': 'Rollout to Stage',
      'description': 'stages the new version into the Stage environment'
    }, {'name': 'Approve', 'description': 'waits for Approval to promote'}, {
      'name': 'Rollout to Run',
      'description': 'promotes to the Run environment'
    }],
    'suggested': true,
    'techPreview': false
  }] as Pipeline[];
}
