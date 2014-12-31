/*global process, require, __dirname*/

(function () {
    "use strict";

    var path = require('path'),
        TypeScript = require('./tsc');

    var args = process.argv;

    var SOURCE_FILE_MAPPINGS_ARG = 2;
    var TARGET_ARG = 3;
    var OPTIONS_ARG = 4;

    var sourceFileMappings = JSON.parse(args[SOURCE_FILE_MAPPINGS_ARG]);
    var target = args[TARGET_ARG];
    var options = JSON.parse(args[OPTIONS_ARG]);

    var inputFileName = sourceFileMappings[0][0],
        outputDirectory = path.join(options.outDir, path.dirname(sourceFileMappings[0][1]));

    console.log('TypeScript args:', args);
    console.log('Started from directory:', __dirname);

    var typeScriptArgs = ['--outDir', outputDirectory, '--module', options.module, '--out', options.out];
    if (options.targetES5) {
        typeScriptArgs = typeScriptArgs.concat(['--target', 'ES5']);
    }
    if (options.sourceMap) {
        typeScriptArgs.push('--sourcemap');
    }
    if (options.noImplicitAny) {
        typeScriptArgs.push('--noImplicitAny');
    }
    if (options.removeComments) {
        typeScriptArgs.push('--removeComments');
    }
    typeScriptArgs.push(inputFileName);

    console.log('Passing args to tsc:', typeScriptArgs);

    var io = TypeScript.IO;
    io.arguments = typeScriptArgs;
    io.quit = function () {
    };

    var results = [], problems = [];

    try {
        var batch = new TypeScript.BatchCompiler(io);
        batch.batchCompile();

        var baseName = path.basename(inputFileName, '.ts');

        results.push({
            source: inputFileName,
            result: {
                filesRead: [inputFileName],
                filesWritten: [path.join(outputDirectory, baseName + '.js')]
            }
        });
    } catch (error) {
        problems.push({
            message: error.toString(),
            severity: 'error'
        });
    }

    console.log(JSON.stringify({results: results, problems: problems}));
    console.log("\u0010" + JSON.stringify({results: results, problems: problems}));
})();
