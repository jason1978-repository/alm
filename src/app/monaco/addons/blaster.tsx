import {server} from "../../../socket/socketClient";
import * as ui from "../../ui";

import CommonEditorRegistry = monaco.CommonEditorRegistry;
import EditorActionDescriptor = monaco.EditorActionDescriptor;
import IEditorActionDescriptorData = monaco.IEditorActionDescriptorData;
import ICommonCodeEditor = monaco.ICommonCodeEditor;
import TPromise = monaco.Promise;
import EditorAction = monaco.EditorAction;
import ContextKey = monaco.ContextKey;
import KeyMod = monaco.KeyMod;
import KeyCode = monaco.KeyCode;


let enabled = false;
class ToggleBlasterAction extends EditorAction {

    static ID = 'editor.action.toggleBlaster';

    constructor(descriptor: IEditorActionDescriptorData, editor: ICommonCodeEditor) {
        super(descriptor, editor);
    }

    public run(): TPromise<boolean> {
        enabled = !enabled;
        if (enabled) {
            ui.notifySuccessNormalDisappear('Have fun 🌹!');
        }
        else {
            ui.notifyInfoQuickDisappear('Hope you had fun 💖');
        }

        return TPromise.as(true);
    }
}

CommonEditorRegistry.registerEditorAction(new EditorActionDescriptor(ToggleBlasterAction, ToggleBlasterAction.ID, 'Toggle Blaster', {
    context: ContextKey.EditorTextFocus,
    primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KEY_O
}));
