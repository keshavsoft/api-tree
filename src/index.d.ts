/**
 * Context passed to the executor function when a leaf method is invoked.
 */
export interface ApiTreeExecutionContext<TSource = Record<string, any>> {
    /** The full dot-notation path of the invoked leaf (e.g. "app.users.profile.fetch") */
    inRoutePath: string;
    /** The first argument passed to the leaf method */
    inParam?: any;
    /** Array of all remaining arguments passed to the leaf method */
    inArgs: any[];
    /** The complete source JSON object */
    inSource: TSource;
}

/**
 * An executor function responsible for handling the execution of an invoked leaf.
 */
export type ApiTreeExecutor<TSource = Record<string, any>, TReturn = any> = (
    context: ApiTreeExecutionContext<TSource>
) => Promise<TReturn> | TReturn;

/**
 * Options for customizing api-tree building behavior.
 */
export interface ApiTreeOptions {
    /**
     * Whether to unwrap a single shared root namespace.
     * Default: true when all paths share one root namespace; false when paths have different roots.
     */
    inUnwrapRoot?: boolean;
}

/**
 * Named argument object for apiTree.
 */
export interface ApiTreeParams<TSource = Record<string, any>, TReturn = any> {
    inSource: TSource;
    inApiPaths: string[];
    inExecutor: ApiTreeExecutor<TSource, TReturn>;
    inOptions?: ApiTreeOptions;
}

/**
 * Builds and returns a callable runtime API tree from source JSON, API paths, and an executor.
 *
 * @param source Source JSON object containing schema definitions
 * @param apiPaths Array of dot-separated route paths (e.g. ["app.users.fetch"])
 * @param executor Execution function invoked when a leaf is called
 * @param options Optional configuration
 */
export declare function apiTree<TSource = Record<string, any>, TReturn = any>(
    source: TSource,
    apiPaths: string[],
    executor: ApiTreeExecutor<TSource, TReturn>,
    options?: ApiTreeOptions
): Record<string, any>;

/**
 * Named argument signature for apiTree.
 */
export declare function apiTree<TSource = Record<string, any>, TReturn = any>(
    params: ApiTreeParams<TSource, TReturn>
): Record<string, any>;

export default apiTree;
