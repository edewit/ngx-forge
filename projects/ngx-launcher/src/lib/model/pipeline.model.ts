export class Pipeline {
  expanded?: boolean;
  name: string;
  id: string;
  platform: string;
  description?: string;
  stages: Stage[];
  suggested?: boolean;
  techPreview?: boolean;
}

export class Stage {
  description: string;
  name: string;
}
