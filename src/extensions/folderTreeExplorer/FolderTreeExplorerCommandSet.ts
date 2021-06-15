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
        //const queryParameters = new URLSearchParams(location.href);
        const queryParameters = new URLSearchParams(location.search); //현재 url에서 파라미터만 가져오기
        const currentFolderPath = queryParameters.get("id") || queryParameters.get("Id") || queryParameters.get("RootFolder");
        let folderUrl: string; //현재 위치
        let listTitle: string; //현재 라이브러리명

        if (queryParameters.has("Id") || queryParameters.has("id") || queryParameters.has("RootFolder")) {
          folderUrl = decodeURIComponent(currentFolderPath);
        }
        else {
          folderUrl = this.context.pageContext.list.serverRelativeUrl;
        }
        listTitle = this.context.pageContext.list.title;
        
        this._renderDialogContainer(listTitle, folderUrl, true);
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _closeDialogContainer = () => {
    this._renderDialogContainer('', '', false);
    ReactDom.unmountComponentAtNode(this.dialogContainer);
  }

  private _renderDialogContainer(currentListTitle: string, currentUrlLocation: string, isDialogDisplayed: boolean) {
    const element: React.ReactElement<any> = React.createElement(
      FolderTreeDialog,
      {
        context: this.context,
        location: currentUrlLocation,
        listTitle: currentListTitle,
        displayDialog: isDialogDisplayed,
        commandTitle: strings.TitleDialog,
        closeDialog: this._closeDialogContainer
      }
    );

    ReactDom.render(element, this.dialogContainer);
  }
}