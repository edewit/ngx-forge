import * as _ from 'lodash';

import { Mission } from '../../model/mission.model';
import { Runtime } from '../../model/runtime.model';
import { Booster, BoosterVersion } from '../../model/booster.model';
import { EmptyReason } from '../../service/mission-runtime.service';

export class ViewMission extends Mission {
  advanced: boolean;
  suggested: boolean;
  disabled: boolean;
  disabledReason?: EmptyReason;
  prerequisite: boolean;
  community: boolean;
  showMore: boolean = false;
  shrinked: boolean = false;
  boosters: Booster[];
}

export class ViewRuntime extends Runtime {
  disabled: boolean;
  disabledReason?: EmptyReason;
  prerequisite: boolean;
  canChangeVersion: boolean;
  suggested: boolean;
  selectedVersion: { id: string; name: string; };
  versions: BoosterVersion[];
  showMore: boolean = false;
  boosters: Booster[];
}

export function createViewMissions(boosters: Booster[]): ViewMission[] {
  const groupedByMission = _.groupBy(boosters, b => b.mission.id);
  return _.values(groupedByMission).map(missionBoosters => {
    const mission = _.first(missionBoosters).mission;
    return {
      id: mission.id,
      name: mission.name,
      description: mission.description,
      community: false,
      advanced: _.get(mission, 'metadata.level') === 'advanced' || _.get(mission, 'metadata.prerequisite', false),
      suggested: _.get(mission, 'metadata.suggested', false),
      showMore: false,
      disabled: true,
      boosters: missionBoosters
    } as ViewMission;
  });
}

export function createViewRuntimes(boosters: Booster[], canChangeVersion: boolean): ViewRuntime[] {
  const groupedByRuntime = _.groupBy(boosters, b => b.runtime.id);
  return _.values(groupedByRuntime).map(runtimeBoosters => {
    const runtime = _.first(runtimeBoosters).runtime;
    return {
      id: runtime.id,
      name: runtime.name,
      description: runtime.description,
      icon: runtime.icon,
      canChangeVersion: canChangeVersion,
      suggested: _.get(runtime, 'metadata.suggested', false),
      prerequisite: _.get(runtime, 'metadata.prerequisite', false),
      showMore: false,
      disabled: true,
      boosters: runtimeBoosters
    } as ViewRuntime;
  });
}

