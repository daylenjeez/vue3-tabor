import type { VNode } from "vue";

type StructureTypes =
  | "Object"
  | "Array"
  | "Function"
  | "String"
  | "Number"
  | "Boolean"
  | "Symbol";

export const isType = (type: StructureTypes) => {
  return (value: unknown) =>
    Object.prototype.toString.call(value) === `[object ${type}]`;
};

export const isFunction = (value: unknown): value is Function =>
  isType("Function")(value);

export const isString = (value: unknown): value is string =>
  isType("String")(value);

export const isNonEmptyString = (value: unknown): boolean =>
  isString(value) && value !== "";

export const isObject = <T extends Record<string, any> = Record<string, any>>(
  value: unknown,
): value is T => isType("Object")(value) && value !== null;

export const throwError = (message: string) => {
  console.error(`[vue3-tabor]: ${message}`);
  return void 0;
};

export const pick = <T extends object, K extends keyof T>(
  base: T,
  ...keys: K[]
): Pick<T, K> => {
  const entries = keys.map((key) => [key, base[key]]);
  return Object.fromEntries(entries);
};

type Fn<Args extends any[], ReturnType, ThisType = any> = (
  this: ThisType,
  ...args: Args
) => ReturnType;

export function withPreAction<Args extends any[], ReturnType, ThisType = any>(
  originalFn: Fn<Args, ReturnType, ThisType>,
  preActionFn: Fn<Args, void, ThisType>,
): Fn<Args, ReturnType, ThisType> {
  return function (this: ThisType, ...args: Args): ReturnType {
    preActionFn.apply(this, args);
    return originalFn.apply(this, args);
  };
}

export function withPostAction<Args extends any[], ReturnType, ThisType = any>(
  originalFn: Fn<Args, ReturnType, ThisType>,
  postActionFn: Fn<Args, void, ThisType>,
): Fn<Args, ReturnType, ThisType> {
  return function (this: ThisType, ...args: Args): ReturnType {
    const res = originalFn.apply(this, args);
    postActionFn.apply(this, args);
    return res;
  };
}

export function renameComponentType(component: VNode, newName: string): VNode {
  return { ...component, type: { ...(component.type as any), name: newName } };
}
