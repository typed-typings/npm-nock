import { EventEmitter } from 'events'

declare function nock (host: string | RegExp, options?: nock.Options): nock.Scope;

declare namespace nock {
  export let back: NockBack;
  export let emitter: EventEmitter;
  export let recorder: Recorder;

  // Nock Back interface: https://github.com/pgte/nock#nock-back.
  // TODO(blakeembrey): Requires help finishing.
  export interface NockBack {
    (path: string, cb: (nockDone: () => void) => any): void;
    fixtures: string;
    setMode (mode: string): void;
    currentMode: string;
  }

  export interface Recorder {
    rec(capture?: boolean): void;
    rec(options?: RecorderOptions): void;
    play(): any[];
  }

  export interface Options {
    allowUnmocked?: boolean;
    reqheaders?: { [key: string]: any };
  }

  export interface RecorderOptions {
    dont_print?: boolean;
    output_objects?: boolean;
    enable_reqheaders_recording?: boolean;
    logging?: (message: string) => any;
    use_separator?: boolean;
  }

  /**
   * Restore the HTTP interceptor to the normal unmocked behaviour.
   */
  export function restore (): void;

  /**
   * Cleanup all the prepared mocks (could be useful to cleanup some state after a failed test).
   */
  export function cleanAll (): void;

  /**
   * You can call `isDone()` on a single expectation to determine if the expectation was met.
   */
  export function isDone (): boolean;

  /**
   * This allows removing a specific interceptor for a url. It's useful when there's a list of common interceptors but one test requires one of them to behave differently.
   */
  export function removeInterceptor (data: {
    hostname: string;
    path: string;
    method?: string;
    proto?: string;
  }): void;

  /**
   * If a scope is not done, you can inspect the scope to infer which ones are still pending using the `scope.pendingMocks()` function.
   */
  export function pendingMocks (): Object[];

  /**
   * By default, if you do not mock a host, a real HTTP request will do, but sometimes you should not permit real HTTP request.
   */
  export function disableNetConnect (): void;

  /**
   * For enabling real HTTP requests.
   */
  export function enableNetConnect (hostname?: string | RegExp): void;

  // TODO(blakeembrey): Complete typings here.
  export function load (pathToJson: string): Object[];
  export function loadDefs (pathToJson: string): Object[];
  export function define (nockDefs: Object[]): Object[];

  export interface Scope {
    intercept (path: string, verb: string, requestBody?: string, options?: any): Scope;

    get (path: string | RegExp): Scope;
    post (path: string | RegExp, body?: string | Object | RegExp): Scope;
    put (path: string | RegExp, body?: string | Object | RegExp): Scope;
    head (path: string | RegExp, body?: string | Object | RegExp): Scope;
    patch (path: string | RegExp, body?: string | Object | RegExp): Scope;
    merge (path: string | RegExp, body?: string | Object | RegExp): Scope;
    delete (path: string | RegExp, body?: string | Object | RegExp): Scope;

    pendingMocks (): Object[];
    done (): void;
    isDone (): boolean;

    filteringPath (regex: RegExp, replace: string): Scope;
    filteringPath (fn: (path: string) => string): Scope;
    filteringRequestBody (regex: RegExp, replace: string): Scope;
    filteringRequestBody (fn: (path: string) => string): Scope;

    defaultReplyHeaders (headers: Object): Scope;

    matchHeader (name: string, value: string | RegExp): Scope;
    matchHeader (name: string, fn: (value: string) => boolean): Scope;

    log (fn: (message: string) => any): Scope;
    persist (): Scope;
    replyContentLength (): Scope;
    replyDate (date: Date): Scope;

    delay (time: number | { head: number; body: number }): Scope;
    delayConnection (timeMs: number): Scope;

    query (params: any): Scope;
    query (acceptAnyParams: boolean): Scope;

    reply (statusCode: number, body?: string | Object, headers?: Object): Scope;
    reply (fn: (uri: string, requestBody: string | Object, cb: (err: Error, response: any[]) => void) => void | any[]): Scope;
    replyWithFile (statusCode: number, fileName: string): Scope;
    replyWithError (error: string | Object): Scope;

    times (repeats: number): Scope;
    once (): Scope;
    twice (): Scope;
    thrice (): Scope;
  }
}

export = nock;
