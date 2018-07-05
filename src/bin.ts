#! /usr/bin/env node

import * as path from 'path'

import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import timelineCli from './index'
timelineCli()