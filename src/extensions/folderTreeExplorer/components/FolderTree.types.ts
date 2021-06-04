import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";

export interface IFolderTreeProps {
    description: string;
    context: any | null;  
  }  

export interface IFolderTreeState {
  TreeLinks: ITreeItem[];
}