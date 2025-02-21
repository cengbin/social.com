/**
 * HTTP请求装饰器模块
 * 提供GET、POST、PUT等HTTP方法的装饰器实现
 */

import { request } from '../request';
import {
  RequestOptions,
  RequestDecoratorOptionsType,
  DecoratorFunction,
  RequestMethodType,
} from '../types';

/**
 * 根据参数和HTTP方法创建请求选项对象
 * @param arg - 字符串URL或请求选项对象
 * @param method - HTTP请求方法
 * @returns 标准化的请求选项对象
 */
function getOptions(arg: any, method: RequestMethodType): RequestOptions {
  const options: RequestOptions = typeof arg === 'string' ? { url: arg } : arg;
  options.method = method;
  return options;
}

/**
 * 验证请求选项的有效性
 * @param options - 请求配置选项
 * @throws {Error} 当URL未提供或HTTP方法不支持时抛出错误
 */
function validateOptions(options: RequestOptions): void {
  if (!options.url) {
    throw new Error('HTTP请求需要URL');
  }
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(options.method)) {
    throw new Error(`不支持的HTTP方法: ${options.method}`);
  }
}

/**
 * 解析URL模板中的参数名
 * @param urlTemplate - URL模板
 * @returns 参数名数组
 */
function extractUrlParams(urlTemplate: string): string[] {
  const params: string[] = [];
  urlTemplate.replace(/:(\w+)/g, (_, param) => {
    params.push(param);
    return '';
  });
  return params;
}

/**
 * 从函数参数中提取URL参数和请求数据
 * @param args - 函数参数
 * @param paramNames - URL参数名数组
 * @returns [urlParams, requestData]
 */
function extractArgsData(args: any[], paramNames: string[]): [Record<string, any>, any] {
  const urlParams: Record<string, any> = {};

  // 如果最后一个参数是对象，且不是URL参数，则视为请求数据
  const hasRequestData = args.length > paramNames.length;
  const requestData = hasRequestData ? args[args.length - 1] : undefined;

  // 提取URL参数
  paramNames.forEach((param, index) => {
    urlParams[param] = args[index];
  });

  return [urlParams, requestData];
}

/**
 * 替换URL中的参数
 * @param url - 原始URL
 * @param params - 参数对象
 * @returns 替换后的URL
 */
function replaceUrlParams(url: string, params: Record<string, any>): string {
  return url.replace(/:(\w+)/g, (_, key) => {
    const value = params[key];
    if (value === undefined) {
      throw new Error(`Missing required URL parameter: ${key}`);
    }
    return String(value);
  });
}

/**
 * 创建HTTP方法装饰器的工厂函数
 * @param method - HTTP请求方法
 * @returns 返回一个装饰器函数
 */
function createMethodDecorator(method: RequestMethodType) {
  return function (arg: string | RequestDecoratorOptionsType): DecoratorFunction {
    // 格式化请求选项
    const options = getOptions(arg, method);
    // 解析URL模板中的参数名
    const paramNames = extractUrlParams(options.url);

    validateOptions(options);

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        try {
          // 从参数中提取URL参数和请求数据
          const [urlParams] = extractArgsData(args, paramNames);
          // 替换URL中的参数
          const url = replaceUrlParams(options.url, urlParams);
          // 获取请求数据
          const data = await originalMethod.apply(this, args);

          options[`${options.method === 'GET' ? 'params' : 'data'}`] = data;
          options.url = url;

          return request(options);
        } catch (error) {
          console.error(`Error in ${propertyKey}:`, error);
          throw error;
        }
      };

      return descriptor;
    };
  };
}

/**
 * GET请求装饰器
 * 用于装饰类方法，将其转换为GET请求（支持动态URL参数）
 * @example
 * ```
 * class UserService {
 *   @Get('/api/users')
 *   async getUsers() {
 *     return { page: 1 }
 *   }
 * }
 * ```
 */
export const Get = createMethodDecorator('GET');

/**
 * POST请求装饰器
 * 用于装饰类方法，将其转换为POST请求（支持动态URL参数）
 * @example
 * ```
 * class UserService {
 *   @Post("/api/user/:id")
 *   async updateUser(id: number,data: any) {
 *     // 函数参数顺序要与URL参数顺序一致
 *     // 最后一个参数为请求数据
 *     return data
 *   }
 * }
 * ```
 */
export const Post = createMethodDecorator('POST');

/**
 * PUT请求装饰器
 * 用于装饰类方法，将其转换为POST请求（支持动态URL参数）
 * @example
 * ```
 * class UserService {
 *   @Put("/api/app/:id/:type")
 *   static async putApp(id: string, type: string, data: any) {
 *     // 函数参数顺序要与URL参数顺序一致
 *     // 最后一个参数为请求数据
 *     return data
 *   }
 * }
 * ```
 */
export const Put = createMethodDecorator('PUT');
export const Delete = createMethodDecorator('DELETE');
