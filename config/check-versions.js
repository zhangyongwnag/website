'use strict'

const chalk = require('chalk')
const child_process = require('child_process')
const {say} = require('cfonts'); // 控制台提示样式
const packageConfig = require('../package.json')

module.exports = function () {
    let node_version = parseInt(process.version.split('.')[0].replace('v', ''))
    let node_target_version = parseInt(packageConfig.engines.node.split('.')[0].replace('>=', ''))
    if (node_version < node_target_version) {
        child_process.exec('start cmd.exe /K node -v')
        child_process.exec('start cmd.exe /K npm -v')
        console.log(chalk.bgRed.black('<------------------ Plan Error ------------------->') + '\n \n node should be ' + chalk.green(packageConfig.engines.node) + '\n \n' + chalk.bgRed.black('<------------------ Plan Error ------------------->'))
        console.log()
        process.exit(1)
    } else {
        console.log(chalk.bgGreen.black('<------------------ Plan Success ------------------->') + '\n \n node version is ' + chalk.green(process.version) + '\n \n' + chalk.bgGreen.black('<------------------ Plan Success ------------------->'))

        console.log()

        say(process.env.NODE_TYPE, {
            colors: ['yellow'],
            font: 'simple3d',
            space: false
        })

        console.log()
    }
}
