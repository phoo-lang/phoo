/**
 * @fileoverview
 * Classes that import loaders for different types of Phoo modules.
 */

import { ModuleNotFoundError, PhooSyntaxError } from './errors.js';

/**
 * Base class for an finder - which locates and retrieves the Phoo code.
 */
export class BaseLoader {
    /**
     * @param {Phoo} phoo The owner that these modules will be loaded into.
     */
    setup(phoo) {
        this.phoo = phoo;
    }
    async load(name, thread) {
        throw 'override me';
    }
}

export class FetchLoader extends BaseLoader {
    constructor(basePath, fetchOptions = {}) {
        super();
        this.basePath = basePath;
        this.fetchOptions = fetchOptions;
    }
    async load(name, thread) {
        var path = this.basePath + name + '.ph';
        var resp = await fetch(path, this.fetchOptions);
        //console.debug('Fetched module', name, 'PH');
        if (!resp.ok)
            return false;
        await thread.run(await resp.text());
        return true;
    }
}

export class ES6Loader extends BaseLoader {
    constructor(basePath) {
        super();
        this.basePath = basePath;
    }
    async load(name, thread) {
        var path = this.basePath + name + '.js';
        var mod;
        try {
            mod = (await import(path)).module;
            if (mod === undefined)
                return false;
        } catch (e) {
            throw ModuleNotFoundError.wrap(e);
        }
        thread.getScope(0).copyFrom(mod);
        return true;
    }
}
