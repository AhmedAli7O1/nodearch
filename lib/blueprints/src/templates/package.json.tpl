{
  "name": "{{packageName}}",
  "version": "0.1.0",
  "description": "{{packageDescription}}",
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "build": "rimraf ./dist/ && tsc",
    "build:watch": "tsc",
    "start": "node dist/start.js"
  },
  "keywords": [],
  "author": "",
  "license": "",
  "devDependencies": {
    "@types/node": "^22.10.10",
    "typescript": "^5.7.3",
    "rimraf": "^6.0.1",
    "reflect-metadata": "^0.2.2"
  },
  "dependencies": {
    "@nodearch/core": "workspace:^2.2.2"
  },
  "nodearch": {}
}
