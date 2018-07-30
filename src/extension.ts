'use strict';
import { window, commands, StatusBarItem, ExtensionContext, StatusBarAlignment } from 'vscode';
import { workingOn, completeTask, newTaskInput, incompleteTasks } from './taskhero';
import { commandWithInput, commandFrom, commandWithQuickPick } from './utils';

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

export function deactivate() {
}