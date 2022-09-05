import { ExpressAnnotationId, HttpMethod, RouteHandlerParam } from '../enums';
import { ComponentFactory } from '@nodearch/core';


export function httpMethodFactory(httpMethod: HttpMethod, path?: string) {
  return ComponentFactory.methodDecorator({
    id: ExpressAnnotationId.HttpMethod,
    fn: (target: any, propKey: string | symbol) => {
      return {
        name: <string>propKey,
        httpMethod,
        httpPath: getPath(path)
      };
    }
  });
}

export function handlerParamFactory (paramType: RouteHandlerParam, key?: string) {
  return ComponentFactory.parameterDecorator({
    id: ExpressAnnotationId.HttpParam,
    fn: () => {
      return {
        type: paramType,
        key
      };
    }
  });
}

export function getPath(path?: string): string {
  let routePath = '/';

  if (path) {
    routePath = path.charAt(0) === '/' ? path : '/' + path;
  }

  return routePath;
}

export function getRouterPrefix(path: string): string {

  if (path === '') {
    return path;
  }
  else {
    let routePath = path.charAt(path.length - 1) === '/' ? path.slice(0, path.length - 1) : path;
    routePath = routePath.charAt(0) === '/' ? routePath : '/' + routePath;

    return routePath;
  }
}