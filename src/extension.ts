// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TdtFoldingRangeProvider, TdtDocumentSymbolProvider, diagnosticTdt } from './tdtParser';

const diagnosticLanguage = (document: vscode.TextDocument,collection: vscode.DiagnosticCollection) : void => {
    switch(document.languageId){
        case "TDT":
            diagnosticTdt(document, collection);
            break;
        default:
            break;
    }
}

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
    
    const tdtDiagnosticCollection = vscode.languages.createDiagnosticCollection('tdt');

    if (vscode.window.activeTextEditor) {
        const document: vscode.TextDocument = vscode.window.activeTextEditor.document;
        diagnosticLanguage(document,tdtDiagnosticCollection);
    }

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor | undefined) => {
        if (e !== undefined) {
            diagnosticLanguage(e.document, tdtDiagnosticCollection);
        }
    }));

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        diagnosticLanguage(e.document, tdtDiagnosticCollection);
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {}
