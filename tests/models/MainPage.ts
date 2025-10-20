import {expect, Locator, Page, test} from "@playwright/test";

interface Elements {
    locator: (page: Page) => Locator;
    name: string;
    text?: string;
    attribute?: {
        type: string;
        value: string;
    }
}

export class MainPage {
    readonly page: Page;
    readonly elements: Elements[];

    constructor(pageInLet: Page) {
        this.page = pageInLet;
        this.elements = [
            {
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Playwright logo Playwright' }),
                name: 'Playwright logo menu item',
                text: 'Playwright',
                attribute: {
                    type: 'href',
                    value: '/',
                }
            },
            {
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Docs' }),
                name: 'Docs menu item',
                text: 'Docs',
                attribute: {
                    type: 'href',
                    value: '/docs/intro',
                }
            },
            {
                locator: (page: Page): Locator => page.getByRole('link', { name: 'API' }),
                name: 'API menu item',
                text: 'API',
                attribute: {
                    type: 'href',
                    value: '/docs/api/class-playwright',
                }
            },
            {
                locator: (page: Page): Locator => page.getByRole('button', { name: 'Node.js' }),
                name: 'Node.js (language list) menu item',
                text: 'Node.js',
            },
            {
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Community' }),
                name: 'Community menu item',
                text: 'Community',
                attribute: {
                    type: 'href',
                    value: '/community/welcome',
                }
            },
            {
                locator: (page: Page): Locator => page.getByRole('link', { name: 'GitHub repository' }),
                name: 'GitHub menu item',
                attribute: {
                    type: 'href',
                    value: 'https://github.com/microsoft/playwright',
                }
            },
            {
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Discord server' }),
                name: 'Discord menu item',
                attribute: {
                    type: 'href',
                    value: 'https://aka.ms/playwright/discord',
                }
            },
            {
                locator: (page: Page): Locator => page.getByRole('button', { name: 'Switch between dark and light' }),
                name: 'Switch theme button',
            },
            {
                locator: (page: Page): Locator => page.locator('html'),
                name: 'html tag',
                attribute: {
                    type: 'data-theme',
                    value: 'light',
                }
            },
            {
                locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Ctrl+K)' }),
                name: 'Search field',
            },
            {
                locator: (page: Page): Locator => page.getByRole('heading', { name: 'Playwright enables reliable' }),
                name: 'Playwright content heading text',
                text: 'Playwright enables reliable end-to-end testing for modern web apps.',
            },
            {
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Get started' }),
                name: 'Get started button',
                text: 'Get started',
                attribute: {
                    type: 'href',
                    value: '/docs/intro',
                }
            },
        ];
    }

    async openMainPage(): Promise<void> {
        await this.page.goto('https://playwright.dev/');
    }

    async checkElementsVisibilityOld(): Promise<void> {
        this.elements.forEach(({locator, name}) => {
            test.step(`Check ${name} element visibility`, async () => {
                await expect.soft(locator(this.page)).toBeVisible();
            });
        });
    }

    async checkElementsVisibility(): Promise<void> {
        for (const { locator, name } of this.elements) {
            await test.step(`Check ${name} element visibility`, async () => {
                await expect.soft(locator(this.page)).toBeVisible();
            });
        }
    }

    async checkElementText(): Promise<void> {
        for (const { locator, name, text } of this.elements) {
            if (text) {
                await test.step(`Check ${name} element name`, async () => {
                    await expect.soft(locator(this.page)).toContainText(text);
                });
            }
        }
    }

    async checkAllElementsAttribute(typeInLet: NonNullable<Elements["attribute"]>["type"]): Promise<void> {
        for (const { locator, name, attribute } of this.elements) {
            if (attribute && attribute.type === typeInLet) {
                await test.step(`Check ${name} element ${attribute.type} attribute value`, async () => {
                    await expect.soft(locator(this.page)).toHaveAttribute(attribute.type, attribute.value);
                });
            }
        }
    }

    //Universal function to check a page element specified attribute value
    async checkElementAttribute(nameInLet: string, typeInLet: string, valueInLet: string): Promise<void> {
        const element = this.elements.find(el => el.name === nameInLet)?.locator(this.page);
        await expect.soft(element).toHaveAttribute(typeInLet, valueInLet);
    }

    async checkDefaultDataThemeAttributeValue(): Promise<void> {
        const element = this.elements.find(el => el.name === 'html tag')?.locator(this.page);
        await expect.soft(element).toHaveAttribute('data-theme', 'light');
    }

    //Universal click method. Clicks an element found by name from page elements list
    async elementClick(nameInLet: string): Promise<void> {
        const element = this.elements.find(el => el.name === nameInLet)?.locator(this.page);
        await expect.soft(element).toBeVisible();
        await element.click();
    }

    async clickThemeSwitcher(): Promise<void> {
        const element = this.elements.find(el => el.name === 'Switch theme button')?.locator(this.page);
        await expect.soft(element).toBeVisible();
        await element.click();
    }

    async setDarkMode(): Promise<void> {
        const switcher = this.elements.find(el => el.name === 'Switch theme button')?.locator(this.page);
        await switcher.click();
        await this.page.waitForTimeout(300);
        await switcher.click();
        await this.page.waitForTimeout(300);
    }

    async checkDarkMode(): Promise<void> {
        const element = this.elements.find(el => el.name === 'html tag')?.locator(this.page);
        await expect.soft(element).toHaveAttribute('data-theme', 'dark');
    }

    async checkLightModeScreenshot(): Promise<void> {
        await expect(this.page).toHaveScreenshot(`page_with_light_mode.png`);
    }

    async checkDarkModeScreenshot(): Promise<void> {
        await expect(this.page).toHaveScreenshot(`page_with_dark_mode.png`);
    }
}