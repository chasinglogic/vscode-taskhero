'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, ExtensionContext, StatusBarAlignment } from 'vscode';
import { workingOn, completeTask, newTaskInput, incompleteTasks } from './tsk';
import { commandWithInput, commandFrom, commandWithQuickPick } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    const status = window
        .createStatusBarItem(StatusBarAlignment.Right, 100);
    status.command = 'extension.currentTask';
    context.subscriptions.push(status);

    updateStatus(status);
    // Update status bar every 30 seconds
    setInterval(() => { updateStatus(status); }, 30 * 1000);

    context.subscriptions.push(
        commands.registerCommand(
            'extension.newTask', commandWithInput(newTaskInput)));

    context.subscriptions.push(
        commands.registerCommand(
            'extension.completeTask', commandFrom(completeTask)));

    context.subscriptions.push(commands.registerCommand(
        'extension.completeTaskById', commandWithQuickPick((selected) => {
            completeTask(selected.split(' ')[0]);
        }, incompleteTasks)
    ));
}

function updateStatus(status: StatusBarItem) {
    workingOn().then((taskTitle: string) => {
        if (taskTitle) {
            status.text = `Working On: ${taskTitle}`;
            status.show();
        } else {
            status.hide();
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}