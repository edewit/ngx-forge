import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/operators/filter';
import 'rxjs/operators/map';

interface BroadcastEvent {
  key: any;
  data?: any;
}

/**
 * Provides detyped notifications of changes in application state.
 *
 * It is recommended that all components and services broadcast events
 * that may be of interest to others. There is no overhead to broadcasting
 * an event that no one is subscribed to.
 *
 * Any events broadcast should be documented as part of the modules API.
 *
 * Example
 * -------
 *
 * In this example we broadcast an event of type cheese and have the mouse
 * subscribe to it.
 *
 *
 *     constructor(
 *       private broadcaster: BroadcastService
 *     )
 *
 *     ngOnInit() {
 *       broadcaster.on<Cheese>('cheese').subscribe(val => this.mouse.eatCheese(val));
 *     }
 *
 *     newCheese() {
 *       broadcaster.broadcast('cheese', { type: 'cheddar' } as Cheese);
 *     }
 *
 */
let instance: BroadcastService;

@Injectable()
export class BroadcastService {
  private _eventBus: Subject<BroadcastEvent> = new Subject<BroadcastEvent>();

  constructor() {
    return instance = instance || this;
  }

  /**
   * Broadcast an event.
   *
   * @param key the key to broadcast the event for. Normally we use a string.
   * @param data the payload to send.
   */
  broadcast(key: any, data?: any) {
    this._eventBus.next({key, data});
  }

  /**
   * Observe an event.
   *
   * @param key the key to observe the event for.
   * @returns an Observable to which you can subscribe or use any RxJS operator.
   *
   */
  on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable()
      .filter((event: BroadcastEvent) => event.key === key)
      .map((event: BroadcastEvent) => <T> event.data);
  }
}
