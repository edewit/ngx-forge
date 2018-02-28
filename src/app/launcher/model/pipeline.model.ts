export class Pipeline {
  expanded?: boolean;
  name: string;
  id: string;
  platform: string;
  stages: [{
    description: string;
    name: string;
  }];
  suggested?: boolean;
  techpreview?: boolean;
}
