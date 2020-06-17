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

const diagnosticTdt = async (document: TextDocument,collection: DiagnosticCollection) => {
    let prevLine:string = "",currentLine:string = "";
    let r: Diagnostic[] = [];
    for(let i = 0; i < document.lineCount; i++) {
        if(i !== 0) {
            prevLine = currentLine;
        }
        currentLine = document.lineAt(i).text;
        if(!currentLine.startsWith("TX=")) {
            const parts: string[] = currentLine.split(",");
            if(parts.length !== 10) {
                let eleNumDiag = new Diagnostic(
                    new Range(
                        new Position(i,0), new Position(i,currentLine.trim().length)
                    ),
                    'The number of TDT configuration items is incorrect.',
                    DiagnosticSeverity.Error
                );
                r.push(eleNumDiag);
            }
        }
    }
    if(r.length > 0) {
        collection.set(document.uri,r);
    } else {
        collection.clear();
    }
}

export {
    TdtFoldingRangeProvider,
    TdtDocumentSymbolProvider,
    diagnosticTdt
}
