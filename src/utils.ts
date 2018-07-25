import * as vscode from 'vscode';

export class Config {
    takeInput: boolean;
    showQuickPic: boolean;
    quickPickOptions: () => Array<string>;

    constructor() {
        this.takeInput = false;
        this.showQuickPic = false;
        this.quickPickOptions = () => { return [] };
    }
}


export function commandFrom(fn: () => void, config?: Config): () => void {
    return () => { fn(); };
}

export function commandWithInput(fn: (input: string) => void): () => void {
    return () => {
        vscode.window.showInputBox().then((input) => {
            if (input == undefined) {
                return;
            }

            fn(input);
        });
    };
}

export function commandWithQuickPick(
    fn: (selected: string) => void,
    getOptions: () => Thenable<Array<string>>
): () => void {
    return () => {
        getOptions().then((options) => {
            vscode.window.showQuickPick(options)
                .then((selected) => {
                    if (selected == undefined) {
                        return
                    }

                    fn(selected);
                })
        })
    }
}