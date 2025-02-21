export type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * 请求选项
 * @property url - 请求地址
 * @property method - 请求方法
 * @property params - Get请求的参数
 * @property data - Post请求的数据
 * @property debug - 是否开启调试模式，开启的情况下会在日志面板输出【请求】和【响应】的日志
 * @property loading - 是否开启全局加载提示
 * @property successNotice - 是否开启成功提示通知
 * @property errorNotice - 是否开启错误提示通知
 * @property formatResponseTime - 是否开启对响应数据中的时间自动格式化成
 * @property getResponse - 是否返回 axios 完整的 response 数据
 */
export type RequestOptions = {
  url: string;
  method?: RequestMethodType;
  params?: any;
  data?: any;
  debug?: boolean;
  loading?: boolean;
  successNotice?: boolean;
  errorNotice?: boolean;
  formatResponseTime?: boolean;
  getResponse?: boolean;
};

/**
 * HTTP请求装饰器参数
 * @property url - 请求地址
 * @property debug - 是否开启调试模式，开启的情况下会在日志面板输出【请求】和【响应】的日志
 * @property loading - 是否开启全局加载提示
 * @property successNotice - 是否开启成功提示通知
 * @property errorNotice - 是否开启错误提示通知
 * @property formatResponseTime - 是否开启对响应数据中的时间自动格式化成
 * @property getResponse - 是否返回 axios 完整的 response 数据
 */
export type RequestDecoratorOptionsType = Omit<RequestOptions, 'method' | 'params' | 'data'>;

export type DecoratorFunction = (
  target: any,
  methodName: string,
  methodDescriptor: PropertyDescriptor
) => void;

/**
 * 响应结构的类型
 * @template T - 响应数据的类型，默认为 any
 * @property code - 响应状态码
 * @property data - 响应数据，类型由泛型 T 决定
 * @property message - 响应消息
 * @property success - 请求是否成功，可选属性
 * @property total_num - 总记录数，可选属性，通常用于分页
 * @property page_num - 当前页码，可选属性，通常用于分页
 * @property page_size - 每页记录数，可选属性，通常用于分页
 */
export type ResponseStructure<T = any> = {
  code: number;
  data: T;
  message: any;
  success?: boolean;
  total_num?: number;
  page_num?: number;
  page_size?: number;
};
