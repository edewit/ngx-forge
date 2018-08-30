import { Cluster } from '../model/cluster.model';
import { Observable } from 'rxjs';

export abstract class TokenService {
  abstract get clusters(): Observable<Cluster[]>;
  abstract createOathLink(cluster: string): string;
}
