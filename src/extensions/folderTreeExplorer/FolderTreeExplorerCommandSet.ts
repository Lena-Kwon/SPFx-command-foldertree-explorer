import * as React from 'react';
import $ from 'jquery';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'FolderTreeExplorerCommandSetStrings';

import { sp } from '@pnp/sp/presets/all';
import FolderTreeDialog from './components/FolderTreeDialog';

const LOG_SOURCE: string = 'FolderTreeExplorerCommandSet';

  export default class FolderTreeExplorerCommandSet extends BaseListViewCommandSet<{}> {
    private dialogContainer: HTMLDivElement = null;
    private commandtitle: string = '';

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
      commandTwo.visible = false; //Command2 버튼 숨김
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'Explorer':
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

    ReactDom.render(element, this.dialogContainer, () =>
    {
      //트리뷰 스크롤
      var intCount = 0;
      var interval = setInterval(() => {
        if (intCount == 10) {
          clearInterval(interval);
        }
 
        if ($("[class^='folderTree']").length > 0 && $("[class*='checked']").length > 0) {
          $("[class^='folderTree']").scrollTop(
            $("[class*='checked']").position().top);
          clearInterval(interval);
        }
 
        intCount++;
      }, 500);
    });
  }
}