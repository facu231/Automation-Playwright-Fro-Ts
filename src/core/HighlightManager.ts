import type { Locator } from 'playwright';

export interface HighlightOptions {
  borderColor?: string;
  backgroundColor?: string;
  durationMs?: number;
}

const PREVIOUS_STYLE_ATTRIBUTE = 'data-fro-previous-style';

export class HighlightManager {
  constructor(private readonly enabled: boolean) {}

  async highlight(locator: Locator, options: HighlightOptions = {}): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const borderColor = options.borderColor ?? '#ff4d00';
    const backgroundColor = options.backgroundColor ?? 'rgba(255, 221, 0, 0.25)';

    await locator.evaluate(
      (element, style) => {
        const htmlElement = element as HTMLElement;
        htmlElement.setAttribute(PREVIOUS_STYLE_ATTRIBUTE, htmlElement.getAttribute('style') ?? '');
        htmlElement.style.outline = `3px solid ${style.borderColor}`;
        htmlElement.style.backgroundColor = style.backgroundColor;
        htmlElement.style.transition = 'outline 120ms ease, background-color 120ms ease';
      },
      { borderColor, backgroundColor }
    );

    if (options.durationMs) {
      await locator.page().waitForTimeout(options.durationMs);
    }
  }

  async remove(locator: Locator): Promise<void> {
    if (!this.enabled) {
      return;
    }

    await locator.evaluate((element) => {
      const htmlElement = element as HTMLElement;
      const previousStyle = htmlElement.getAttribute(PREVIOUS_STYLE_ATTRIBUTE);

      if (previousStyle !== null) {
        htmlElement.setAttribute('style', previousStyle);
        htmlElement.removeAttribute(PREVIOUS_STYLE_ATTRIBUTE);
      } else {
        htmlElement.style.outline = '';
        htmlElement.style.backgroundColor = '';
      }
    });
  }
}
