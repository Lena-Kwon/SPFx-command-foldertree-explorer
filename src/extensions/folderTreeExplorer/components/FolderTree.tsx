import * as React from 'react';
import styles from './FolderTree.module.scss';
import { IFolderTreeProps } from './FolderTree.types';
import { IFolderTreeState } from './FolderTree.types';

import { TreeView, ITreeItem, TreeViewSelectionMode, TreeItemActionsDisplayMode } from "@pnp/spfx-controls-react/lib/TreeView";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";

import  IServiceProvider from '../services/IServiceProvider';
import { ServiceProvider } from '../services/ServiceProvider';

export default class TreeViewDemo extends React.Component<IFolderTreeProps, IFolderTreeState> {
  constructor(props: IFolderTreeProps) {
    super(props);
    this.onTreeItemExpandCollapse = this.onTreeItemExpandCollapse.bind(this);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      TreeLinks: []
    };

    this._getLinks();
  }
  
  
  private async _getLinks() {
    const dataProvider: IServiceProvider = new ServiceProvider();
    const treeArr: ITreeItem[] = await dataProvider.GetRootFolders();

    this.setState({TreeLinks: treeArr});
  }

  public render(): React.ReactElement<IFolderTreeProps> {
    console.log('render()' + this.state);
    return (
      <div className={styles.folderTree}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>[ DocumentLibrary Folder Tree ]</span>
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onTreeItemSelect(items: ITreeItem[]) {
    console.log("Items selected: ", items);
  }

  private async onTreeItemExpandCollapse(item: ITreeItem, isExpanded: boolean) {
    if (isExpanded) {
      //item : DocLibraryT
      const dataProvider: IServiceProvider = new ServiceProvider();
      const treeItem: ITreeItem = await dataProvider.GetSubFolders(item);

      this.setState({TreeLinks: this.state.TreeLinks});
    }
  }

  private renderCustomTreeItem(item: ITreeItem): JSX.Element {
    return (
      <span>
        <a href={item.data} target={'_blank'}>
          {item.label}
        </a>
      </span>
    );
  }

}
