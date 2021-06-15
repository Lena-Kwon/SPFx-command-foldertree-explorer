declare interface IFolderTreeExplorerCommandSetStrings {
  TitleDialog: string;
  LabelCurrentLocation: string;
  ButtonMove: string;
  ButtonlCancel: string;
  ButtonClose: string;
  Explorer: string;
}

declare module 'FolderTreeExplorerCommandSetStrings' {
  const strings: IFolderTreeExplorerCommandSetStrings;
  export = strings;
}
