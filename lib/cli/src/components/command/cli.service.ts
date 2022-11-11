import { Service } from '@nodearch/core';
import yargs, { Argv, Arguments, CommandModule } from 'yargs';
import { AppService } from '../app/app.service';


@Service()
export class CliService { 

  private args: any;

  constructor(
    private readonly appService: AppService
  ) {}

  async start() {
    this.args = yargs
      .scriptName('nodearch')
      .usage('Usage: nodearch <command> [options]')
      .demandCommand()

      // .example('new', 'Generates a new app')
      // .example('build', 'Build the app')
      // .example('start', 'Starts the app')

      .alias('h', 'help')
      .alias('v', 'version')

      .option('path', {
        alias: ['p'],
        string: true,
        describe: 'App file path'
      })

      // .option('notify', { 
      //   alias: ['y'], 
      //   boolean: true, 
      //   default: true,
      //   describe: 'turn desktop notifier on or off' 
      // })

      .pkgConf('nodearch')
      .argv;

  }


}