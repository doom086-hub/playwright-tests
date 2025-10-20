import {Browser, test} from "@playwright/test";


export class Misc {
    readonly browser: Browser;

    constructor(browserInLet: Browser) {
        this.browser = browserInLet;
    }

    async browserInfo() {
        test.info().annotations.push({
            type: 'browser',
            description: this.browser.browserType().name() + " " + this.browser.version(),
        });
    }
}