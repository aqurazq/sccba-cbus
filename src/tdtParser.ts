import {
    FoldingRangeProvider, TextDocument, FoldingContext, CancellationToken,
    FoldingRange, FoldingRangeKind, DocumentSymbolProvider, SymbolInformation,
    Position, SymbolKind, Location, Diagnostic, DiagnosticCollection, Range,
    DiagnosticSeverity, DiagnosticRelatedInformation
} from 'vscode';


class TdtFoldingRangeProvider implements FoldingRangeProvider {
    async provideFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken) {
        const r: FoldingRange[] = [];
        let prev:number, current:number = -1;
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i).text;
            if(line.length > 4 && line.startsWith("TX=")) {
                prev = current;
                current = i;
                if(prev >= 0 && current >= 0) {
                    r.push(new FoldingRange(prev,current - 1,FoldingRangeKind.Region))
                }
            }
        }
        r.push(new FoldingRange(current,document.lineCount - 1,FoldingRangeKind.Region))
        return r;
    }
}

class TdtDocumentSymbolProvider implements DocumentSymbolProvider {
    async provideDocumentSymbols(document: TextDocument, token: CancellationToken) {
        let r: SymbolInformation[] = [];
        const containerName: string = "";
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i).text;
            if(line.length > 4 && line.startsWith("TX=")) {
                let position : Position = new Position(i,line.length);
                let location : Location = new Location(document.uri, position);
                r.push(new SymbolInformation(line.substr(3),SymbolKind.Method,containerName,location));
            }
        }
        return r;
    }
    
}

const diagnosticTdt = (document: TextDocument,collection: DiagnosticCollection): void => {
    /*let diag1: Diagnostic = new Diagnostic(
        new Range(
            new Position(3, 4), new Position(3, 12),
        ),
        '循环变量重复赋值',
        DiagnosticSeverity.Error,
    );
    diag1.source = 'basic-lint';
    diag1.relatedInformation = [new DiagnosticRelatedInformation(
        new Location(document.uri,
            new Range(new Position(2, 4), new Position(2, 5))),
        '第一次赋值')];
    diag1.code = 102;
    collection.set(document.uri,[diag1]); */
}

export {
    TdtFoldingRangeProvider,
    TdtDocumentSymbolProvider,
    diagnosticTdt
}
