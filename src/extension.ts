'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workingOn, completeTask, newTaskInput, incompleteTasks } from './tsk';
import { commandWithInput, commandFrom, commandWithQuickPick } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.newTask', commandWithInput(newTaskInput)));

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.completeTask', commandFrom(completeTask)));

    context.subscriptions.push(vscode.commands.registerCommand(
        'extension.completeTaskById', commandWithQuickPick((selected) => {
            completeTask(selected.split(' ')[0]);
        }, incompleteTasks)
    ));

    const status = vscode.window
        .createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    status.command = 'extension.currentTask';
    status.text = 'Working On: Loading...';
    status.show();
    context.subscriptions.push(status);

    workingOn().then((taskTitle: string) => {
        status.text = `Working On: ${taskTitle}`;
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}