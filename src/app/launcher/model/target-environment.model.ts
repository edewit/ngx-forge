import { Cluster } from "./cluster.model";

export class TargetEnvironment {
  description: string;
  benefits: string[];
  footer: string;
  header: string;
  icon: string;
  id: string;
  styleClass: string;
  clusters?: Cluster[];
}
