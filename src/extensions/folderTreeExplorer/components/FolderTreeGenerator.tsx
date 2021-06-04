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
  OverflowSet, Separator, Coachmark, TeachingBubbleContent
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
import { TreeView, ITreeItem, TreeViewSelectionMode, TreeItemActionsDisplayMode } from "@pnp/spfx-controls-react/lib/TreeView";
import  IServiceProvider from '../services/IServiceProvider';
import { ServiceProvider } from '../services/ServiceProvider';

interface IFolderControllerProps {
  context: ListViewCommandSetContext;
  currentLocation: string;
  commandTitle: string;
  hideDialog: boolean;
  closeDialog: () => void;
}

const FolderController: React.FunctionComponent<IFolderControllerProps> = (props) => {

  //const [isCoachmarkVisible, { setFalse: hideCoachmark, setTrue: showCoachmark }] = useBoolean(false);
  const [TreeLinks, setLinks] = useState({});
  
  const calloutStackTokens: IStackTokens = {
    childrenGap: 20,
    maxWidth: 400
  };

  const foldersStackTokens: IStackTokens = {
    childrenGap: 20
  };

  async function getTreeLinks() {

  }
  function createFoldersClick() {
    //setTaskStatus(TaskState.progress);

  }

  function closeDialog(ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    props.closeDialog();
  }

  //TREE
  function onTreeItemSelect(items: ITreeItem[]) {
    console.log("Items selected: ", items);
  }

  async function onTreeItemExpandCollapse(item: ITreeItem, isExpanded: boolean) {
    if (isExpanded) {
      //item : DocLibraryT
      const dataProvider: IServiceProvider = new ServiceProvider();
      const treeItem: ITreeItem = await dataProvider.GetSubFolders(item);

      this.setState({TreeLinks: this.state.TreeLinks});
    }
  }

  function renderCustomTreeItem(item: ITreeItem): JSX.Element {
    return (
      <span>
        <a href={item.data} target={'_blank'}>
          {item.label}
        </a>
      </span>
    );
  }

  return (
    <Dialog
      hidden={props.hideDialog}
      minWidth={500}
      dialogContentProps={{
        type: DialogType.normal,
        title: props.commandTitle
      }}

      modalProps={{
        isBlocking: true,
      }}
      onDismiss={closeDialog}>
      <div className={styles.folderTreeGenerator}>
        <div className={styles.container}>
          <Label className={styles.location}>{`${strings.LabelCurrentLocation} ${props.currentLocation.replace('/Lists', '')}`}</Label>
          
          <TreeView
            items={this.state.TreeLinks}
            defaultExpanded={false}
            selectionMode={TreeViewSelectionMode.None}
            selectChildrenIfParentSelected={true}
            showCheckboxes={false}
            expandToSelected={false}
            defaultExpandedChildren={false}
            treeItemActionsDisplayMode={TreeItemActionsDisplayMode.ContextualMenu}
            onSelect={this.onTreeItemSelect}
            onExpandCollapse={this.onTreeItemExpandCollapse}
            onRenderItem={this.renderCustomTreeItem} />

          <Separator />
        </div>
      </div>
      <DialogFooter>
          <PrimaryButton
            text={strings.ButtonMove}
            onClick={createFoldersClick} />
        <DefaultButton onClick={closeDialog} text={strings.ButtonClose} />
      </DialogFooter>
    </Dialog>
  );
};

export default FolderController;