import * as React from 'react';
import { useState, useReducer, useEffect } from 'react';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
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

interface IFolderControllerProps {
  context: ListViewCommandSetContext;
  currentLocation: string;
  commandTitle: string;
  hideDialog: boolean;
  closeDialog: () => void;
}

const FolderController: React.FunctionComponent<IFolderControllerProps> = (props) => {

  const calloutStackTokens: IStackTokens = {
    childrenGap: 20,
    maxWidth: 400
  };

  const foldersStackTokens: IStackTokens = {
    childrenGap: 20
  };

  function createFoldersClick() {
    //setTaskStatus(TaskState.progress);

  }

  function closeDialog(ev?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    props.closeDialog();
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
