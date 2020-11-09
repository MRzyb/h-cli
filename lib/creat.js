const fs = require('fs')
const path = require('path')
const axios = require('axios')
const chalk = require('chalk')
const inquirer = require('inquirer')
const {promisify} = require('util')
const downloadGitRepo = require('download-git-repo')
const validateProjectName = require('validate-npm-package-name')
const {waitFnLoading} = require('../utils/spinner')
// 转promise
const download = promisify(downloadGitRepo)

const getRepoList = async () => {
    const {data} = await axios.get('https://api.github.com/users/MRzyb/repos')
    return data
}

const downloadTemp = async (repo, projectName) => {
    const api = `MRzyb/${repo}`
    await download(api, path.resolve(__dirname, projectName))
    return path.resolve(__dirname, 'demo')
}

const create = async (projectName, options) => {
    const cwd = options.cwd || process.cwd()
    const inCurrent = projectName === '.'
    const name = inCurrent ? path.relative('../', cwd) : projectName
    const targetDir = path.resolve(cwd, projectName || '.')

    console.log('1', options.merge)

    // 校验项目名字是否合法
    const result = validateProjectName(name)
    if (!result.validForNewPackages) {
        console.error(chalk.red(`Invalid project name: "${projectName}"`))
        result.errors && result.errors.forEach(err => {
            console.error(chalk.red('Error: ' + err))
        })
        result.warnings && result.warnings.forEach(warn => {
            console.error(chalk.red.dim('Warning: ' + warn))
        })
        process.exit(1)
    }

    console.log(fs.existsSync(targetDir), targetDir)
    // 当前目录已存在 inCurrent存在的话确定是否在当前目录中生成项目
    if (fs.existsSync(targetDir)) {
        if (inCurrent) {
            const {ok} = await inquirer.prompt({
                name: 'ok',
                type: 'confirm',
                message: 'Generate project in current directory?'
            })
            console.log('ok', ok)
            if (!ok) {
                return
            }
        } else {

        }
    }

    return
    // 获取项目模板
    let repos = await waitFnLoading(getRepoList, 'Fetching template...')()
    const tempList = repos.map(item => item.name)
    const {repo} = await inquirer.prompt({
        name: 'repo',
        type: 'list',
        message: '请选择你需要的模板',
        choices: tempList
    })
    // 下载模板
    const a = await waitFnLoading(downloadTemp, 'downloading...')(repo, projectName)
    console.log('a', a)
}

module.exports = create
