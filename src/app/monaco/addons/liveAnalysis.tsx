import {CompositeDisposible} from "../../../common/events";
import {cast, server} from "../../../socket/socketClient";
import * as utils from "../../../common/utils";
import * as state from "../../state/state";

require('./liveAnalysis.css');
type Editor = monaco.editor.ICommonCodeEditor;

const overrideClassName = 'monaco-live-analysis-override';
const overrideDecorationOptions: monaco.editor.IModelDecorationOptions = {
    glyphMarginClassName: overrideClassName,
    isWholeLine: true,
    hoverMessage: 'Overrides a base class member. Click to navigate.'
};


export function setup(cm: Editor): { dispose: () => void } {
    // if (cm) return { dispose: () => null }; // DEBUG : while the feature isn't complete used to disable it

    let lastDecorations: string[] = [];
    // The key quick fix get logic
    const refreshLiveAnalysis = () => {
        // If not active project return
        if (!state.inActiveProjectFilePath(cm.filePath)) {
            if (lastDecorations.length) {
                lastDecorations = cm.deltaDecorations(lastDecorations, []);
            }
            return;
        }

        // query the server with live analysis
        server.getLiveAnalysis({
            filePath: cm.filePath,
        }).then(res => {
            const newDecorations = res.overrides.map(override => {
                const result: monaco.editor.IModelDeltaDecoration = {
                    range: {
                        startLineNumber: override.line + 1,
                        endLineNumber: override.line + 1,
                    } as monaco.Range,
                    options: overrideDecorationOptions
                }
                return result;
            });

            lastDecorations = cm.deltaDecorations(lastDecorations, newDecorations);
        });
    };

    const refreshLiveAnalysisDebounced = utils.debounce(refreshLiveAnalysis, 3000);

    const disposible = new CompositeDisposible();
    cm.onDidFocusEditor(refreshLiveAnalysisDebounced);
    cm.onDidChangeModelContent(refreshLiveAnalysisDebounced);
    const disposeProjectWatch = cast.activeProjectConfigDetailsUpdated.on(() => {
        refreshLiveAnalysisDebounced();
    });

    /**
     * Also subscribe to the user clicking the margin
     * For demo see `debugEditorContribution` in vscode source
     */
    // cm.onEditorMouseDown(()=>{
    //     console.log('here');
    // })

    return disposible;
}
