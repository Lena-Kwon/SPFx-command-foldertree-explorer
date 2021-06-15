import * as React from 'react';
import { useState, useReducer, useEffect } from 'react';

import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";

import { HttpRequestError } from "@pnp/odata";
import { IFolder } from '@pnp/sp/folders';
import { ListViewCommandSetContext } from '@microsoft/sp-listview-extensibility';
import { Dialog, DialogType, DialogFooter, DefaultButton, PrimaryButton,
  IContextualMenuProps, getId, IStackTokens,
  KeyCodes, ITextFieldStyleProps, ITextFieldStyles, TooltipHost,
  Spinner, SpinnerSize, Icon, ITextFieldProps, Stack, IconButton,
  MessageBar, MessageBarType, Label, TextField, Toggle, Callout, DirectionalHint,
  OverflowSet, Separator, Coachmark, TeachingBubbleContent, IIconProps
} from '@fluentui/react';
//import { useBoolean } from '@uifabric/react-hooks';
//import { FolderStatus } from '../../../constants/FolderStatus';
//import { TaskState } from '../../../constants/TaskState';
//import ICustomItem from '../../../interfaces/ICustomItem';
//import { Constants } from '../../../constants/Constants';
//import FolderButton from './FolderButton';
//import IProcessFolder from '../../../interfaces/IProcessFolder';
import * as strings from 'FolderTreeExplorerCommandSetStrings';
import styles from './FolderTreeGenerator.module.scss';

//트리관련 import 
import { IFolderTreeProps } from './FolderTree.types';
import { IFolderTreeState } from './FolderTree.types';
import { TreeView, ITreeItem, TreeViewSelectionMode, TreeItemActionsDisplayMode, SelectChildrenMode } from "@pnp/spfx-controls-react/lib/TreeView";
import  IServiceProvider from '../services/IServiceProvider';
import { ServiceProvider } from '../services/ServiceProvider';

interface IFolderControllerProps {
  context: ListViewCommandSetContext;
  currentLocation: string;
  currentListTitle: string;
  commandTitle: string;
  hideDialog: boolean;
  closeDialog: () => void;
}

  export default class FolderController extends React.Component<IFolderControllerProps, IFolderTreeState> {
    constructor(props: IFolderControllerProps) {
      super(props);
      //this.onTreeItemExpandCollapse = this.onTreeItemExpandCollapse.bind(this);
      this.onTreeItemSelect = this.onTreeItemSelect.bind(this);
      this.createFoldersClick = this.createFoldersClick.bind(this);

      this.state = {
        TreeLinks: [],
        selectLocation: ''
      };
  
      this._getLinks();
    }

    private async _getLinks() {
        const dataProvider: IServiceProvider = new ServiceProvider();
        const treeArr: ITreeItem[] = await dataProvider.GetRootFolders(this.props.currentListTitle);
      
        //console.log('_getLinks: ' + this.props.currentLocation);
        this.setState({TreeLinks: treeArr, selectLocation: this.props.currentLocation});
    }

    /*
    private closeDialog(ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        console.log('테스트 closeDialog 실행됨');
        this.props.closeDialog();
    }
    */

    /* Close 버튼 클릭 이벤트 */
    private closeDialog = () => {
        //console.log('테스트 closeDialog 실행됨');
        //this._getLinks();
        this.props.closeDialog();
    }

    /* Move 버튼 클릭 이벤트 */
    private createFoldersClick() {
        location.href = this.state.selectLocation;
    }
    
    public render(): React.ReactElement<IFolderTreeProps> {
    console.log('render()' + this.state.TreeLinks.length);
    return (
        <div>
            <Dialog
            hidden={this.props.hideDialog}
            minWidth={400}
            dialogContentProps={{
            type: DialogType.normal,
            title: this.props.commandTitle
            }}

            modalProps={{
            isBlocking: true,
            }}
            onDismiss={this.closeDialog}>
            <div className={styles.folderTreeGenerator}>
            <div className={styles.container}>
                <Label className={styles.location}>{`${strings.LabelCurrentLocation} ${this.props.currentLocation.replace('/Lists', '')}`}</Label>
                {/*<Label className={styles.location}>{`${strings.LabelCurrentLocation} ${this.state.selectLocation.replace('/Lists', '')}`}</Label>*/}
                
                <TreeView
                items={this.state.TreeLinks}
                defaultExpanded={true}
                selectionMode={TreeViewSelectionMode.Single}
                selectChildrenIfParentSelected={false}
                showCheckboxes={false}
                expandToSelected={true}
                defaultSelectedKeys={[`${this.state.selectLocation}`]}
                defaultExpandedChildren={false}
                treeItemActionsDisplayMode={TreeItemActionsDisplayMode.ContextualMenu}
                onSelect={this.onTreeItemSelect}
                /*onExpandCollapse={this.onTreeItemExpandCollapse}*/
                onRenderItem={this.renderCustomTreeItem} />

                <Separator />
            </div>
            </div>
            <DialogFooter>
                <PrimaryButton
                text={strings.ButtonMove}
                onClick={this.createFoldersClick} />
            <DefaultButton onClick={this.closeDialog} text={strings.ButtonClose} />
            </DialogFooter>
            </Dialog>
        </div>
        );
    }

    /* 트리 아이템 선택 이벤트 */
    private onTreeItemSelect(items: ITreeItem[]) {
      //console.log("테스트 Items selected: ", items);
      this.setState({selectLocation: items[0].key});
    }

    /* 트리 아이템 확장/축소 이벤트(현재 사용X) */
    private async onTreeItemExpandCollapse(item: ITreeItem, isExpanded: boolean) {
        console.log("테스트 onTreeItemExpandCollapse: ", item.label);
        if (isExpanded) {
            //item : DocLibraryT
            //const dataProvider: IServiceProvider = new ServiceProvider();
            //const treeItem: ITreeItem = await dataProvider.GetSubFolders(item);

            //this.setState({TreeLinks: this.state.TreeLinks});
        }
    }

    private renderCustomTreeItem(item: ITreeItem): JSX.Element {
      console.log('테스트');
        return (
          <span>
            {item.label}
          </span>
        );
    }
}