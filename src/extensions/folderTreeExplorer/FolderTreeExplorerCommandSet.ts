import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
//import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'FolderTreeExplorerCommandSetStrings';

import { sp } from '@pnp/sp/presets/all';
import { IListInfo } from '@pnp/sp/lists';
import { SPPermission } from '@microsoft/sp-page-context';

import FolderTreeDialog from './components/FolderTreeDialog';
import {IFolderTreeProps} from './components/FolderTree.types';

const LOG_SOURCE: string = 'FolderTreeExplorerCommandSet';

//export default class FolderTreeExplorerCommandSet extends BaseListViewCommandSet<IFolderTreeExplorerCommandSetProperties> {
  export default class FolderTreeExplorerCommandSet extends BaseListViewCommandSet<{}> {
    private dialogContainer: HTMLDivElement = null;
    private commandtitle: string = '';
    //private displayCommand: boolean = false; //false여서 안나왔음 

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized FolderTreeExplorerCommandSet');
    const commandExplorer: Command = this.tryGetCommand('Explorer');

    if (commandExplorer) {
      sp.setup({
        spfxContext: this.context
      });

      this.dialogContainer = document.body.appendChild(document.createElement("div"));
    }
    
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    //const commandExplorer: Command = this.tryGetCommand('Explorer');
    const commandTwo: Command = this.tryGetCommand('COMMAND_2');
    if (commandTwo) {
      //Command2 버튼 숨김
      commandTwo.visible = false;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'Explorer':
        //Dialog.alert(`${this.properties.sampleTextOne}`);
        const queryParameters = new URLSearchParams(location.href);
        const currentFolderPath = queryParameters.get("id") || queryParameters.get("Id") || queryParameters.get("RootFolder");
        let folderUrl: string;

        if (queryParameters.has("Id") || queryParameters.has("id")) {
          folderUrl = decodeURIComponent(currentFolderPath);
        }
        else {
          folderUrl = this.context.pageContext.list.serverRelativeUrl;
          
        }
        
        console.log('테스트 queryParameters: ' + queryParameters);
        console.log('테스트 currentFolderPath: ' + currentFolderPath);
        console.log('테스트 folderUrl: ' + folderUrl);
        console.log('테스트1: ' + queryParameters.get("RootFolder"));
        console.log('테스트1: ' + queryParameters.get("Id"));
        this._renderDialogContainer(folderUrl, true);
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _closeDialogContainer = () => {
    this._renderDialogContainer('', false);
  }

  private _renderDialogContainer(currentUrlLocation: string, isDialogDisplayed: boolean) {
    const element: React.ReactElement<any> = React.createElement(
      FolderTreeDialog,
      {
        context: this.context,
        location: currentUrlLocation,
        displayDialog: isDialogDisplayed,
        commandTitle: strings.TitleDialog,
        closeDialog: this._closeDialogContainer
      }
    );
    console.log('테스트: renderDia실행됨'); //OK
    ReactDom.render(element, this.dialogContainer);
  }
}
