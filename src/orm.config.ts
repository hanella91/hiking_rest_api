import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TreeLevelColumn } from 'typeorm';

function ormConfig(): TypeOrmModuleOptions {

  const commonConf = {
    SYNCRONIZE: false,
    ENTITIES: [__dirname + '/entity/*.entity{.ts, .js}'],
    MIGRATIONS: [__dirname + '/migrations/**/*.{.ts,.js}'],
    CLI: {
      migrationsDir: 'src/migrations',
    },
    MIGRATIONS_RUN: false,
  };

  const ormconfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'hikers',
    entities: commonConf.ENTITIES,
    synchronize: commonConf.SYNCRONIZE,
    logging: true,
    migrations: commonConf.MIGRATIONS,
    migrationsRun: commonConf.MIGRATIONS_RUN
  };

  return ormconfig;
}

export { ormConfig };
