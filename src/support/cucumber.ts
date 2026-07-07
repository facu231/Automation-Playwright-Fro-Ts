import type { CustomWorld } from './world';
import type { Page } from 'playwright';

export function requireWorldPage(world: CustomWorld): Page {
  return world.getPage();
}

export function currentScenarioName(world: CustomWorld): string {
  return world.scenarioName;
}
