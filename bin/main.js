#!/usr/bin/env node

const {program} = require('commander')
const chalk = require('chalk')
const packageJson = require('../package.json')

program.version(packageJson.version)
    .command('create [projectName]')
    .alias('c')
    .description('通过create 创建项目')
    .action((projectName, option) => {
       require('../lib/creat')(projectName, option)
    })


program.parse(process.argv)

