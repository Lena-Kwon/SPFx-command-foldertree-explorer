
import * as React from 'react';
import { useState, useEffect } from 'react';
import FolderTreeGenerator from './FolderTreeGenerator1';
import { ListViewCommandSetContext } from '@microsoft/sp-listview-extensibility';

export interface IFolderTreeDialogProps {
  context: ListViewCommandSetContext;
  location: string;
  displayDialog: boolean;
  commandTitle: string;
  closeDialog: () => void;
}

export interface IFolderTreeDialogState {
  hideDialog: boolean;
}

const FolderTreeDialog: React.FunctionComponent<IFolderTreeDialogProps> = (props) => {
  //console.log('테스트 FolderTreeDia..tsx 실행');
  const [dialogState, setDialogState] = useState(!props.displayDialog);

  useEffect(() => {
    setDialogState(!props.displayDialog);
  }, [props.displayDialog]);

  return (
    <FolderTreeGenerator
      context={props.context}
      currentLocation={props.location}
      commandTitle={props.commandTitle}
      hideDialog={dialogState}
      closeDialog={props.closeDialog} />
  );
};

export default FolderTreeDialog;
