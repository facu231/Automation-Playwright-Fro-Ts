import type { CustomWorld } from './world';

export function requireWorldPage(world: CustomWorld) {
  return world.getPage();
}

export function currentScenarioName(world: CustomWorld): string {
  return world.scenarioName;
}
