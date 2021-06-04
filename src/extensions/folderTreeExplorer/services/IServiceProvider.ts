import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";

export default interface IServiceProvider {
    GetRootFolders(): Promise<ITreeItem[]>;
    GetSubFolders(item: ITreeItem): Promise<ITreeItem>;
}