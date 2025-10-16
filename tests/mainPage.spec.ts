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
        locator: (page: Page): Locator => page.locator('html'),
        name: 'html tag',
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

const themeMods = ['light', 'dark'];


test.describe('Main page tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://playwright.dev/');
    });

    test('Check page elements displaying', async ({page, browser}) => {
        test.info().annotations.push({
            type: 'browser',
            description: browser.browserType().name() + " " + browser.version(),
        });
        elements.forEach(({locator, name}) => {
            test.step(`Check ${name} element visibility`, async () => {
                await expect.soft(locator(page)).toBeVisible();
            });
        });
    });

    test('Check page elements names', async ({page, browser}) => {
        test.info().annotations.push({
            type: 'browser',
            description: browser.browserType().name() + " " + browser.version(),
        });
        elements.forEach(({locator, name, text}) => {
            if (text) {
                test.step(`Check ${name} element name`, async () => {
                    await expect.soft(locator(page)).toContainText(text);
                });
            }
        });
    });

    test('Check elements href attributes values', async ({page, browser}) => {
        test.info().annotations.push({
            type: 'browser',
            description: browser.browserType().name() + " " + browser.version(),
        });
        elements.forEach(({locator, name, attribute}) => {
            if (attribute && attribute.type === 'href') {
                test.step(`Check ${name} element href attribute value`, async () => {
                    await expect.soft(locator(page)).toHaveAttribute(attribute.type, attribute.value);
                });
            }
        });
    });

    test("Check header nav element - theme switcher", async ({page}) => {
        await page.getByLabel('Switch between dark and light mode').click();
        await expect.soft(page.locator('html')).toHaveAttribute('data-theme', 'light');
    });

    themeMods.forEach(theme => {
        test(`Check styles of active ${theme} theme mode`, async ({page}) => {
            await page.evaluate((theme) => {
                document.querySelector('html')?.setAttribute('data-theme', theme);
            }, theme);
            //await page.waitForLoadState('networkidle');
            await expect(page).toHaveScreenshot(`page_with_${theme}_mode.png`);
        })
    });

    test('1 Check styles of active theme mode', async ({page}) => {
        themeMods.forEach((theme) => {
            console.log(`Start: ${theme}`);
            const switcher = page.getByRole('button', { name: 'Switch between dark and light' });
            const html = page.locator('html');
            const doSwitch = async () => {
                await expect(switcher).toBeVisible();
                await switcher.click();
                console.log('switcher clicked');
            }
            test.step(`Check styles of active ${theme} theme mode`, async () => {
                let htmlTheme = await html.getAttribute('data-theme');
                console.log(`1 Actual: ${htmlTheme} Expected: ${theme}`);
                if (htmlTheme === theme) {
                    console.log('1st if');
                    await expect.soft(page).toHaveScreenshot(`page_with_${theme}_mode.png`);
                }
                else {
                    console.log('1st else');
                    await doSwitch();
                    //await page.waitForTimeout(500);
                    htmlTheme = await html.getAttribute('data-theme');
                    console.log(`2 Actual: ${htmlTheme} Expected: ${theme}`);
                }
                if (htmlTheme === theme) {
                    console.log('2nd if');
                    await expect.soft(page).toHaveScreenshot(`page_with_${theme}_mode.png`);
                }
                else {
                    console.log('2nd else');
                    await doSwitch();
                    await page.waitForTimeout(500);
                    htmlTheme = await html.getAttribute('data-theme');
                    console.log(`3 Actual: ${htmlTheme} Expected: ${theme}`);
                    await expect.soft(page).toHaveScreenshot(`page_with_${theme}_mode.png`);
                }

            });
        });
    });

    test('2 Check styles of active theme mode', async ({page}) => {
        const switcher = page.getByRole('button', { name: 'Switch between dark and light' });
        const html = page.locator('html');
        themeMods.forEach((theme) => {
            console.log(`Start: ${theme}`);
            test.step(`Check styles of active ${theme} theme mode`, async () => {
                const doSwitch = async () => {
                    await expect(switcher).toBeVisible();
                    await switcher.click();
                    console.log('switcher clicked');
                    await page.waitForTimeout(1000);
                };
                let htmlTheme = await html.getAttribute('data-theme');
                console.log(`1 Actual: ${htmlTheme} Expected: ${theme}`);
                if (htmlTheme !== theme) {
                    console.log('1st if');
                    await doSwitch();
                    htmlTheme = await html.getAttribute('data-theme');
                    console.log(`2 Actual: ${htmlTheme} Expected: ${theme}`);
                }
                if (htmlTheme !== theme) {
                    console.log('2st if');
                    await doSwitch();
                    htmlTheme = await html.getAttribute('data-theme');
                    console.log(`3 Actual: ${htmlTheme} Expected: ${theme}`);
                }
                await expect.soft(page).toHaveScreenshot(`page_with_${theme}_mode.png`);
                console.log(`4 Actual: ${htmlTheme} Expected: ${theme}`);
            });
        });
    });

    test('3 Check styles of active theme mode', async ({ page }) => {
        // Получаем локаторы из массива по name
        const switcher = elements.find(el => el.name === 'Switch theme button')?.locator(page);
        const html = elements.find(el => el.name === 'html tag')?.locator(page);

        // Проверка на случай, если элемент не найден
        if (!switcher || !html) {
            throw new Error('Required elements not found in elements array');
        }

        // Универсальная функция переключения темы с повторной попыткой
        const doSwitch = async () => {
            await expect.soft(switcher).toBeVisible();

            for (let attempt = 1; attempt <= 2; attempt++) {
                await switcher.click();
                await page.waitForTimeout(500); // даём время UI обновиться

                const newTheme = await html.getAttribute('data-theme');
                console.log(`Switch attempt ${attempt}: new theme = ${newTheme}`);

                // Если тема сменилась, выходим
                if (newTheme) return newTheme;

                // Если после первой попытки не поменялась — пробуем ещё раз
                if (attempt === 1) {
                    console.warn('Theme did not switch, retrying...');
                }
            }

            throw new Error('Theme did not switch after 2 attempts');
        };

        for (const theme of themeMods) {
            await test.step(`Check styles of active ${theme} theme mode`, async () => {
                let htmlTheme = await html.getAttribute('data-theme');
                console.log(`Initial Attribute: ${htmlTheme}, Expected Theme: ${theme}`);

                if (htmlTheme !== theme) {
                    htmlTheme = await doSwitch();
                }

                // Если после переключения всё ещё не совпадает — делаем последнюю проверку
                if (htmlTheme !== theme) {
                    console.warn(`After switch, theme is still "${htmlTheme}", expected "${theme}". Trying again...`);
                    htmlTheme = await doSwitch();
                }

                // Убедимся, что тема действительно установилась
                await expect(html).toHaveAttribute('data-theme', theme);

                // Скриншот в правильной теме
                await expect(page).toHaveScreenshot(`page_with_${theme}_mode.png`);
            });
        }
    });

});

