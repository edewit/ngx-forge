import * as _ from 'lodash';
import { Broadcaster } from 'ngx-base';
import { Injector } from '@angular/core';
import { PropertiesGetter } from './properties';
import { eventKeyMap } from './woopra-key-map';

export class StaticInjector {
    private static injector: Injector = null;
    static setInjector(injector: Injector) {
        StaticInjector.injector = injector;
    }

    static getInjector(): Injector {
        return StaticInjector.injector;
    }
}

export function broadcast(event: string, properties: any): MethodDecorator {
    return function (target: Function, methodName: string, descriptor: any) {

        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const injectorInstance = StaticInjector.getInjector();
            if (!injectorInstance || !injectorInstance.get(Broadcaster)) {
                return originalMethod.apply(this, args);
            }

            const broadcaster: Broadcaster = injectorInstance.get(Broadcaster);
            const values = new PropertiesGetter(this, args).mapKeys(_.cloneDeep(properties));

            broadcaster.broadcast('analyticsTracker', {
                event: eventKeyMap[event],
                data: values
            });
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
