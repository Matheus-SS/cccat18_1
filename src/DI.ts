export class Registry {
    private dependencies: { [name: string]: any } = {};

    private static instance: Registry;

    private constructor() {
        this.dependencies = {}
    }

    provide(name: string, dependencies: any) {
        this.dependencies[name] = dependencies;
    }

    inject(name: string) {
        return this.dependencies[name];
    }

    static getInstance() {
        if (!Registry.instance) {
           Registry.instance = new Registry();
        }
        return Registry.instance;
    }
}

//@ decorator
export function inject(name: string) {
    return function (target: any, propertyKey: string) {
        target[propertyKey] = new Proxy({}, {
            get(target, propertyKey) {
                const dependency = Registry.getInstance().inject(name);
                return dependency[propertyKey];
            }
        })
    }
}