import { describe, it, expect, vi } from 'vitest';
import {
  isType,
  isFunction,
  isString,
  isNonEmptyString,
  isObject,
  throwError,
  pick,
  withPreAction,
  withPostAction,
  renameComponentType
} from '@routerTab/utils';
import { h } from 'vue';

describe('Utils Functions', () => {
  describe('isType', () => {
    it('should correctly identify types', () => {
      expect(isType('Object')({})).toBe(true);
      expect(isType('Array')([])).toBe(true);
      expect(isType('Function')(() => { })).toBe(true);
      expect(isType('String')('')).toBe(true);
      expect(isType('Number')(123)).toBe(true);
      expect(isType('Boolean')(true)).toBe(true);
      expect(isType('Symbol')(Symbol())).toBe(true);

      expect(isType('Object')([])).toBe(false);
      expect(isType('Array')({})).toBe(false);
      expect(isType('Function')({})).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should identify functions correctly', () => {
      expect(isFunction(() => { })).toBe(true);
      expect(isFunction(function () { })).toBe(true);
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should identify strings correctly', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString(null)).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should identify non-empty strings correctly', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should identify objects correctly', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject([])).toBe(false); // 在实现中，数组不被视为对象
      expect(isObject(null)).toBe(false); // null is not considered an object here
      expect(isObject(undefined)).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject('string')).toBe(false);
    });
  });

  describe('throwError', () => {
    it('should log error message and return undefined', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      const result = throwError('Test error');

      expect(consoleSpy).toHaveBeenCalledWith('[vue3-router-tab]: Test error');
      expect(result).toBeUndefined();

      consoleSpy.mockRestore();
    });
  });

  describe('pick', () => {
    it('should pick specified properties from an object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };

      expect(pick(obj, 'a', 'c')).toEqual({ a: 1, c: 3 });
      expect(pick(obj, 'b')).toEqual({ b: 2 });
      expect(pick(obj, 'a', 'b', 'c', 'd')).toEqual(obj);
      expect(pick(obj)).toEqual({});
    });
  });

  describe('withPreAction', () => {
    it('should execute pre-action before main function', () => {
      const executionOrder: string[] = [];

      const preAction = () => {
        executionOrder.push('pre');
      };

      const mainFunction = () => {
        executionOrder.push('main');
        return 'result';
      };

      const enhancedFunction = withPreAction(mainFunction, preAction);
      const result = enhancedFunction();

      expect(executionOrder).toEqual(['pre', 'main']);
      expect(result).toBe('result');
    });

    it('should pass arguments to both functions', () => {
      const preActionSpy = vi.fn();
      const mainFunctionSpy = vi.fn().mockReturnValue('result');

      const enhancedFunction = withPreAction(mainFunctionSpy, preActionSpy);
      enhancedFunction('arg1', 'arg2');

      expect(preActionSpy).toHaveBeenCalledWith('arg1', 'arg2');
      expect(mainFunctionSpy).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('withPostAction', () => {
    it('should execute post-action after main function', () => {
      const executionOrder: string[] = [];

      const postAction = () => {
        executionOrder.push('post');
      };

      const mainFunction = () => {
        executionOrder.push('main');
        return 'result';
      };

      const enhancedFunction = withPostAction(mainFunction, postAction);
      const result = enhancedFunction();

      expect(executionOrder).toEqual(['main', 'post']);
      expect(result).toBe('result');
    });

    it('should pass arguments to both functions', () => {
      const postActionSpy = vi.fn();
      const mainFunctionSpy = vi.fn().mockReturnValue('result');

      const enhancedFunction = withPostAction(mainFunctionSpy, postActionSpy);
      enhancedFunction('arg1', 'arg2');

      expect(mainFunctionSpy).toHaveBeenCalledWith('arg1', 'arg2');
      expect(postActionSpy).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('renameComponentType', () => {
    it('should rename component type name', () => {
      const vnode = h('div', { class: 'test' });
      const renamed = renameComponentType(vnode, 'NewName');

      expect(renamed.type).toHaveProperty('name', 'NewName');
    });
  });
}); 
