import {test, expect, Page, Locator} from '@playwright/test';

interface Elements {
    locator: (page: Page) => Locator;
    name: string;
    text?: string;
    attribute?: {
        type: string;
        value: string;
    }
}

const elements: Elements[] = [
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
        locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Ctrl+K)' }),
        name: 'Search field',
    },
];


test.describe('Main page tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://playwright.dev/');
    });

    test('Check header nav elements displaying', async ({page}) => {
        elements.forEach(({locator, name}) => {
            test.step(`Check ${name} menu element visibility`, async () => {
                await expect.soft(locator(page)).toBeVisible();
            });
        });
    });

    test('Check header nav elements names', async ({page}) => {
        elements.forEach(({locator, name, text}) => {
            if (text) {
                test.step(`Check ${name} menu element name`, async () => {
                    await expect.soft(locator(page)).toContainText(text);
                });
            }
        });
    });

    test('Check header nav elements href attributes values', async ({page}) => {
        elements.forEach(({locator, name, attribute}) => {
            if (attribute && attribute.type === 'href') {
                test.step(`Check ${name} menu element href attribute values`, async () => {
                    await expect.soft(locator(page)).toHaveAttribute(attribute.type, attribute.value);
                });
            }
        });
    });

    test("Check header nav element - theme switcher", async ({page}) => {
        await page.getByLabel('Switch between dark and light mode').click();
        await expect.soft(page.locator('html')).toHaveAttribute('data-theme', 'light');
    });

    test('Check content text', async ({page, browser}) => {
        test.info().annotations.push({
            type: 'browser',
            description: browser.browserType().name() + " " + browser.version(),
        });
        await expect.soft(page.getByRole('heading', { name: 'Playwright enables reliable' })).toBeVisible();
        await expect.soft(page.getByRole('heading', { name: 'Playwright enables reliable' })).toContainText('Playwright enables reliable end-to-end testing for modern web apps.');
    });

    test('Check Get started button', async ({page}) => {
        await expect.soft(page.getByRole('link', { name: 'Get started' })).toBeVisible();
        await expect.soft(page.getByRole('link', { name: 'Get started' })).toContainText('Get started');
        await expect.soft(page.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/docs/intro');
    });
});

