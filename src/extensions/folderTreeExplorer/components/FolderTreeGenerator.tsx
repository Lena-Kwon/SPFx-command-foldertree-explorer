import * as React from 'react';

import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";

import { ListViewCommandSetContext } from '@microsoft/sp-listview-extensibility';
import { Dialog, DialogType, DialogFooter, DefaultButton, PrimaryButton, Separator,
  //IContextualMenuProps, getId, IStackTokens,
  //KeyCodes, ITextFieldStyleProps, ITextFieldStyles, TooltipHost,
  //Spinner, SpinnerSize, Icon, ITextFieldProps, Stack, IconButton,
  //MessageBar, MessageBarType, Label, TextField, Toggle, Callout, DirectionalHint,
  //OverflowSet, Coachmark, TeachingBubbleContent, IIconProps, IconNames
} from '@fluentui/react';

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
      this.createFoldersClick = this.createFoldersClick.bind(this);
      this.onTreeItemSelect = this.onTreeItemSelect.bind(this);
      this.onTreeItemExpandCollapse = this.onTreeItemExpandCollapse.bind(this);
      
      this.state = {
        TreeLinks: [],
        selectLocation: ''
      };
      this._getLinks();
    }

    /* 트리정보 가져오기 */
    private async _getLinks() {
        const dataProvider: IServiceProvider = new ServiceProvider();
        const treeArr: ITreeItem[] = await dataProvider.GetRootFolders(this.props.currentListTitle);
      
        this.setState({TreeLinks: treeArr, selectLocation: this.props.currentLocation});
    }

    /* Close 버튼 클릭 이벤트 */
    private closeDialog = () => {
        this.props.closeDialog();
    }

    /* Move 버튼 클릭 이벤트 */
    private createFoldersClick() {
        location.href = this.state.selectLocation;
    }

    public render(): React.ReactElement<IFolderTreeProps> {
      console.log('render()' + this.state.TreeLinks.length);
      if (this.state.TreeLinks.length == 0) return <div></div>;
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
                  {/*<Label className={styles.location}>{`${strings.LabelCurrentLocation} ${this.props.currentLocation.replace('/Lists', '')}`}</Label>*/}
                  
                  <div className={styles.folderTree}>
                    <TreeView
                    items={this.state.TreeLinks}
                    defaultExpanded={false}
                    selectionMode={TreeViewSelectionMode.Single}
                    showCheckboxes={false}
                    defaultSelectedKeys={[`${this.state.selectLocation}`]}
                    defaultExpandedChildren={false}
                    expandToSelected={true}
                    treeItemActionsDisplayMode={TreeItemActionsDisplayMode.ContextualMenu}
                    onSelect={this.onTreeItemSelect}
                    //onExpandCollapse={this.onTreeItemExpandCollapse}
                    //onRenderItem={this.renderCustomTreeItem}
                    />
                  </div>
                  
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
      console.log("테스트 Items selected: ", items);
      this.setState({selectLocation: items[0].key});
    }

    /* 트리 아이템 확장/축소 이벤트 */
    private async onTreeItemExpandCollapse(item: ITreeItem, isExpanded: boolean) {
        if (isExpanded) {
          item.iconProps = { iconName: 'FabricOpenFolderHorizontal', style: { color: '#EDD200',},};
        }
        else {
          item.iconProps = { iconName: 'FabricFolderFill', style: { color: '#EDD200',},};
        }
    }

    /* 사용X */
    /*
    private renderCustomTreeItem(item: ITreeItem): JSX.Element {
        return (
          <div className={item.key}>
            {
              item.iconProps && <Icon iconName={item.iconProps.iconName} style={{ paddingRight: '8px', fontSize: 'medium' }}></Icon>
            }
            {item.label}
          </div>
        );
    }
    */
}