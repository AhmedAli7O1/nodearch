import { ComponentFactory } from '@nodearch/core/components';
import { JsonataDecorator } from '../enums.js';
import { ComponentScope } from '@nodearch/core';


// export const JsonataTransform = (options: any): ClassDecorator =>
//   ComponentFactory.componentDecorator({
//     id: JsonataDecorator.JsonataTransform,
//     options: {
//       scope: ComponentScope.SINGLETON
//     },
//     fn: () => {
//       return options;
//     }
//   });

export const JsonGet = (path: string): PropertyDecorator => 
  ComponentFactory.propertyDecorator({
    id: JsonataDecorator.JsonGet,
    fn: () => {
      return {
        path
      };
    }
  });
