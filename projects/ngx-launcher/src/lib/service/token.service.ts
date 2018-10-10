import { Observable } from 'rxjs';
import { Cluster } from '../model/cluster.model';

export abstract class TokenService {
  abstract get clusters(): Observable<Cluster[]>;
  abstract createOathLink(cluster: string): string;
}
