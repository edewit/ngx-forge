import { StepState, Projectile } from './summary.model';
import { GitHubDetails } from './github-details.model';
import { HttpParams } from '@angular/common/http';

describe('State saving and restoring', () => {
  class TestableProjectile<T> extends Projectile<T> {
    protected searchParams() {
      return new URLSearchParams(this.toUrl());
    }
  }

  it('should save the state in an url', () => {
    const projectile = new TestableProjectile<GitHubDetails>();
    const gitHubDetails = new GitHubDetails();
    const state = new StepState(gitHubDetails, [
      { name: 'repository', value: 'repository' },
      { name: 'organization', value: 'organization' }
    ]);

    gitHubDetails.repository = 'repo';
    gitHubDetails.organization = 'org';
    gitHubDetails.login = 'ignored';

    projectile.setState('myId', state);

    expect(projectile.toUrl()).toBe('?selectedSection=&myId=%7B%22repository%22%3A%22repo%22%2C%22organization%22%3A%22org%22%7D');
    expect(projectile.getSavedState('myId')).toEqual({ repository: 'repo', organization: 'org' });
  });

  it('should create HttpParams of the state', () => {
    const projectile = new Projectile<any>();
    projectile.setState('1', new StepState<any>({ 'param1': 'value1' }, [{ name: 'p1', value: 'param1' }]));
    projectile.setState('2', new StepState<any>({ 'param2': 'value2' }, [{ name: 'p2', value: 'param2' }]));

    const http = new HttpParams();
    http.append('p1', 'value1');
    http.append('p2', 'value2');

    expect(projectile.toHttpPayload()).toEqual(http);
  });
});
