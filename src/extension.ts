// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TdtFoldingRangeProvider, TdtDocumentSymbolProvider, diagnosticTdt } from './tdtParser';

export function activate(context: vscode.ExtensionContext) {
    const tdtSel:vscode.DocumentSelector = { scheme: 'file', language: 'TDT' };
    const cbusBaseDir = vscode.workspace.getConfiguration().get<string>("cbus.basedir");
    console.log(cbusBaseDir);

    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(
        tdtSel, new TdtFoldingRangeProvider()
    ));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        tdtSel, new TdtDocumentSymbolProvider()
    ));
    
    const diag_coll = vscode.languages.createDiagnosticCollection('tdt');

    if (vscode.window.activeTextEditor) {
        diagnosticTdt(vscode.window.activeTextEditor.document, diag_coll);
    }

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(
        (e: vscode.TextEditor | undefined) => {
            if (e !== undefined) {
                diagnosticTdt(e.document, diag_coll);
        }
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {}
