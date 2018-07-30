import * as vscode from 'vscode';
import * as process from 'child_process';

function runCmd(cmd: string, msg?: string): Thenable<string> {
    return new Promise((resolve, reject) => {
        process.exec(cmd, (err, stdout, stderr) => {
            if (err) {
                if (msg) {
                    vscode.window.showWarningMessage(msg);
                } else {
                    vscode.window.showWarningMessage(`Error running task cmd ${cmd}`);
                }

                console.log(stderr);
                return reject(stderr);
            }

            return resolve(stdout);
        });
    });
}

export function completeTask(id?: string) {
    if (id === null || id === undefined) {
        id = '';
    } else {
        id = ` ${id}`;
    }

    runCmd(`task complete${id}`);
}


export function newTask(
    title: string,
    priority?: number,
    context?: string,
    body?: string
) {
    let cmd = `task new ${title}`

    if (priority) {
        cmd += ` --priority ${priority}`
    }

    if (context) {
        cmd += ` --context ${context}`
    }

    if (body) {
        cmd += ` --body ${body}`
    }

    runCmd(cmd, 'Unable to create new task')
}

function getFieldValue(parseable: any): [string, number | string] {
    let fieldName = '';
    let valueStr = '';
    let valueFound = false;

    for (let char in parseable) {
        if (char === ':') {
            valueFound = true;
            continue;
        }

        if (valueFound) {
            valueStr += char;
        } else {
            fieldName += char;
        }
    }

    let value: number | string = valueStr;
    if (fieldName === 'priority') {
        value = parseFloat(value);
    }

    return [fieldName, value];
}

export function newTaskInput(input: string) {
    let title: Array<string> = [];
    let priority = null;
    let context = null;
    let body = null;

    for (let word in input.split(' ')) {
        if (word.startsWith('#')) {
            let [fieldName, value] = getFieldValue(word.slice(1));

            switch (fieldName) {
                case 'priority':
                    priority = value;
                case 'context':
                    context = value;
                case 'body':
                    body = value;
            }

            continue;
        }

        title.push(word);
    }

    let args: Array<any> = [title, undefined, undefined, undefined];
    if (priority) {
        args[1] = priority;
    }

    if (context) {
        args[2] = context;
    }

    if (body) {
        args[3] = body;
    }

    newTask.apply(args);
}

export function incompleteTasks(): Thenable<Array<string>> {
    return runCmd('task query completed = false')
        .then(output => output.split('\n'));
}

export function workingOn(): Thenable<string> {
    return runCmd('task next --title-only');
}