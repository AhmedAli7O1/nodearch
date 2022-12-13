import path from 'path';
import { App } from '@nodearch/core';
import { ExpressApp, ExpressOAIProvider } from '@nodearch/express';
import { OpenAPI, OpenAPIApp } from '@nodearch/openapi';
import { SwaggerApp } from '@nodearch/swagger';


export default class MyApp extends App {
  constructor() {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      extensions: [
        new ExpressApp(),
        new OpenAPIApp({ 
          providers: [ExpressOAIProvider],
          openAPI: {
            info: {
              title: 'NodeArch Express Template',
              version: '0.1.0'
            }
          } 
        }),
        new SwaggerApp({ openAPI: OpenAPI })
      ]
    });
  }
} 