export type ApiExecutor<TSource = Record<string, unknown>, TResult = unknown, TParam = unknown> = (input: {
    inRoutePath: string;
    inParam: TParam;
    inSource: TSource;
}) => TResult | Promise<TResult>;

export type ApiPaths = string[];

export default function start<TSource = Record<string, unknown>, TResult = unknown, TParam = unknown>(
    source: TSource,
    apiPaths: ApiPaths,
    executor: ApiExecutor<TSource, TResult, TParam>
): Record<string, unknown>;

export function start<TSource = Record<string, unknown>, TResult = unknown, TParam = unknown>(
    source: TSource,
    apiPaths: ApiPaths,
    executor: ApiExecutor<TSource, TResult, TParam>
): Record<string, unknown>;
