import IServiceProvider from './IServiceProvider';

import { sp } from "@pnp/sp";
import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { IFolderInfo, IListInfo } from "@pnp/sp/presets/all";

export class ServiceProvider implements IServiceProvider {
    public async GetRootFolders(currentList: string): Promise<ITreeItem[]> {
        return new Promise<ITreeItem[]>(async (resolve) => {
            let rtnArray: ITreeItem[] = [];
            //console.log('테스트_currentList' + currentList);
            //const lists: IListInfo[] = await sp.web.lists.filter(`BaseTemplate eq 101`).expand('RootFolder').orderBy('Created').get();
            const lists: IListInfo = await sp.web.lists.getByTitle(currentList).expand('RootFolder').get();
            
            rtnArray.push(await this.GetSubFolderUsingListInfo(lists));
            
            /*
            const rtn: ITreeItem[] = await Promise.all(lists.map(async (l) => {
                return this.GetSubFolderUsingListInfo(l);
            }));
            */

            //resolve(rtn);
            resolve(rtnArray);
        });
    }

    //트리 아이템 확장 시 호출
    public async GetSubFolders(item: ITreeItem): Promise<ITreeItem> {
        return new Promise<ITreeItem>(async (resolve) => {
            let rtnItem: ITreeItem;

            const folders: IFolderInfo[] = await sp.web.getFolderByServerRelativeUrl(item.key).folders.filter(`Name ne 'Forms' and ProgID ne 'OneNote.Notebook'`).orderBy('Name').get();

            const rtn: ITreeItem[] = await Promise.all(folders.map(async (f) => {
                return this.GetSubFolderUsingFolderInfo(f);
            }));

            rtn.forEach((d) => {
                const treecol: Array<ITreeItem> = item.children.filter((value) => { return value.key == d.key; });
                if (treecol.length == 0) {
                  item.children.push(d);
                }
            });

            resolve(item);
        });
    }

    private async GetSubFolderUsingListInfo(l: IListInfo): Promise<ITreeItem> {
        return new Promise<ITreeItem>((resolve) => {

            sp.web.getFolderByServerRelativeUrl(l.RootFolder.ServerRelativeUrl).folders.filter(`Name ne 'Forms' and ProgID ne 'OneNote.Notebook'`).get()
                .then((folders) => {
                    if (folders.length > 0) {
                        //서브폴더 있음
                        const tree: ITreeItem = {
                            key: l.RootFolder.ServerRelativeUrl,
                            label: l.Title,
                            data: l.RootFolder.ServerRelativeUrl,
                            selectable: true,
                            children: []
                        };
                        //console.log('트리추가됨(서브O): ' + tree.label );
                        resolve(this.GetSubFolders(tree));
                        //resolve(tree);
                    }
                    else {
                        //서브폴더 없음
                        const tree: ITreeItem = {
                            key: l.RootFolder.ServerRelativeUrl,
                            label: l.Title,
                            data: l.RootFolder.ServerRelativeUrl
                        };
                        //console.log('트리추가됨(서브X): ' + tree.label );
                        resolve(tree);
                    }
                });
        });
    }

    private async GetSubFolderUsingFolderInfo(f: IFolderInfo): Promise<ITreeItem> {
        return new Promise<ITreeItem>((resolve) => {

            sp.web.getFolderByServerRelativeUrl(f.ServerRelativeUrl).folders.filter(`Name ne 'Forms' and ProgID ne 'OneNote.Notebook'`).get()
                .then((folders) => {
                    if (folders.length > 0) {
                        //서브폴더 있음
                        const tree: ITreeItem = {
                            key: f.ServerRelativeUrl,
                            label: f.Name,
                            data: f.ServerRelativeUrl,
                            selectable: true,
                            children: []
                        };
                        //console.log('부모트리에 child로 push함(하위O): ' + tree.label );
                        //resolve(tree);
                        resolve(this.GetSubFolders(tree));
                    }
                    else {
                        //서브폴더 있음
                        const tree: ITreeItem = {
                            key: f.ServerRelativeUrl,
                            label: f.Name,
                            data: f.ServerRelativeUrl
                        };
                        //console.log('부모트리에 child로 push함(하위X): ' + tree.label );
                        resolve(tree);
                    }
                });
        });
    }

}