import { InitApp } from './src/scripts/InitApp';
import { config } from 'dotenv';
import { connect, disconnect } from './src/db/db';

config();
connect();

InitApp.InitImportantData();
