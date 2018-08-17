# REST API Requirements for Launcher

### Missions & Runtimes

##### Client code:
[Mission/Runtime Service](service/mission-runtime.service.ts)  
[Mission Model](model/mission.model.ts)  
[Runtime Model](model/runtime.model.ts)  

##### API:
GET Runtimes
- runtimeId: string;
- title: string;
- description: string;
- logo: string; - URL of logo of runtime
- supportedMissions: string[];
- versions: string[];
- version: string; - default version to display in dropdown
- projectName: string; - generated default
- mavenArtifact: string; - generated default
- projectVersion: string; - generated default
- groupId: string; - generated default
  
GET Missions
- missionId: string;
- suggested?: boolean;
- title: string;
- description: string;
- supportedRuntimes: string[];

---

### Target Environment
Only visible from Launch website, can select:
 - OpenShift
 - OpenShift.io [future]
 - Zip file

##### Client code:
- [Cluster Service](service/cluster.service.ts)  
- [Cluster Model](model/cluster.model.ts)  

##### API:
GET Clusters (Authenticated with OpenShift token)  
Returns <Clusters[]>:
 - clusterId: string;
 - name: string;

---

### Release Strategy  
This is the list of pipelines that can be used for building and releasing the selected mission/runtime.

##### Client code:
[Pipeline Service](service/pipeline.service.ts)  
[Pipeline Model](model/pipeline.model.ts)

##### API:
GET Pipelines  
Returns <Pipelines[]:
- pipelineId: string;  
- suggested?: boolean;  
- name: string;  
- description: string;   
- stages: string[];

---

### Project Summary Step

##### Client code:
[Selection Model](model/selection.model.ts)  
[Summary Model](model/summary.model.ts)  
[Launcher Service](service/launcher.service.ts)  

If targetEnvironment === 'zip', this will let them download the zip file.

##### API:

POST Validate  (Authenticated with OpenShift/GitHub Tokens)
- missionId: string;
- runtimeId: string;
- runtimeVersion: string;  
- targetEnvironment: string;
- clusterId: string;
- pipelineId: string;
- projectName: string;
- mavenArtifact: string;
- projectVersion: string;
- groupId: string;
- spacePath?: string;
- organization: string;
- repository: string;  

Returns validation result (status including which field is invalid)

POST Save  (Authenticated with OpenShift/GitHub Tokens)
- missionId: string;
- runtimeId: string;
- runtimeVersion: string;
- targetEnvironment: string;
- clusterId: string;
- pipelineId: string;
- projectName: string;
- mavenArtifact: string;
- projectVersion: string;
- groupId: string;
- spacePath?: string;
- organization: string;
- repository: string;  

Returns Websocket URL which allows progress tracking (need more information on this...)


 