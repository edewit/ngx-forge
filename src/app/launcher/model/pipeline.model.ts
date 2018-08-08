export class Pipeline {
  expanded?: boolean;
  name: string;
  id: string;
  platform: string;
  description?: string;
  stages: [{
    description: string;
    name: string;
  }];
  suggested?: boolean;
  techPreview?: boolean;
}
