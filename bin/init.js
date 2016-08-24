#!/usr/bin/env node
var ch = require('child_process');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var _ = require('lodash');
var gutil = require('gulp-util');

var logger = console.log.bind(console);
var projectPath = process.cwd();
var exec = ch.exec;

module.exports = function(name) {

    // 项目规范文件拷贝
    gulp.task('copy', function(callback) {
        gutil.log(gutil.colors.yellow('----> 开始初始化'));

        exec('git clone git@gitlab.qima-inc.com:zent/zent-seed.git ' + name, function(err, stdout, stderr) {
            gutil.log('-------> 拉取 zent-seed');
            exec('rm -rf ./' + name + '/.git', function(err, stdout, stderr) {
                callback();
            });
        });
    });

    // 单独再导入readme
    gulp.task('init:readme', function(callback) {
        gutil.log('-------> 生成 readme');

        var documentation = fs.readFileSync(path.resolve(__dirname, '../readme.md'));
        var fileName = path.resolve(projectPath, './' + name + '/readme.md');
        var file = _.template(fs.readFileSync(fileName))({
            name: name,
            documentation: documentation
        });
        fs.writeFile(fileName, file);

        callback();
    });

    // 单独再导入package.sjon
    gulp.task('init:package', function(callback) {
        gutil.log('-------> 生成 package.json');

        var fileName = path.resolve(projectPath, './' + name + '/package.json');
        var file = _.template(fs.readFileSync(fileName))({
            name: name
        });
        fs.writeFile(fileName, file);

        callback();
    });

    // 项目依赖安装
    gulp.task('install:npm', function(callback) {
        gutil.log('-------> 安装 依赖....');

        exec('which npm', function(err, stdout, stderr) {
            var Npath = stdout.toString().trim();
            var command = Npath + ' i --registry="http://registry.npm.qima-inc.com"';
            exec(command, {cwd: projectPath + '/' + name}, function(err, stdout, stderr) {
                logger(stdout + '');
                callback();
            });
        });
    });

    gulp.task('install:felint', function(callback) {
        var felintCmd = 'felint init -6 --youzan';
        gutil.log('------> 初始化 ' + felintCmd);

        exec('cd ' + name + '; ' + felintCmd, function(err, stdout, stderr) {
            if (err) {
                gutil.log(gutil.colors.red(stderr));
                gutil.log(gutil.colors.red('执行 felint 指令失败，请检查本地 felint 是否正确安装后重新运行zent-kit'));
                gutil.log(gutil.colors.green('felint 安装指令：ynpm(npm) install -g felint'));
            } else {
                gutil.log(gutil.colors.green('初始化完成'));
            }
            callback();
        });
    });

    if (!name) {
        logger('   sir: we need a project name');
        return;
    }

    runSequence('copy', 'init:readme', 'init:package', 'install:npm', 'install:felint');
};
