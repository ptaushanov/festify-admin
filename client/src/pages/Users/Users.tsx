import DataGrid, { Column, HeaderFilter, Item, Pager, Paging, SearchPanel, Toolbar } from "devextreme-react/data-grid";
import trpc from '../../services/trpc';
import ImageCell from "./components/ImageCell";

export default function Users() {
    const pageSizes = [5, 10, 20]
    const { data } = trpc.user.getAllUsers.useQuery()

    return (
        <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold">
                Users
            </h1>

            <DataGrid
                dataSource={data}
                rowAlternationEnabled
                focusedRowEnabled
                showBorders
                keyExpr="id"
                columnAutoWidth
                allowColumnResizing
                className="card p-8 rounded-md shadow-sm bg-base-100 mt-10 w-full"
            >
                <HeaderFilter visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} width={200} />
                <Column dataField="username" dataType="string" />
                <Column dataField="xp" dataType="string" />
                <Column dataField="current_lesson" dataType="string" />
                <Column
                    dataField="avatar"
                    dataType="string"
                    cellRender={ImageCell}
                    allowFiltering={false}
                    allowSorting={false}
                    allowSearch={false}
                />
                <Pager
                    allowedPageSizes={pageSizes}
                    showPageSizeSelector
                    showNavigationButtons
                    showInfo
                    visible={true}
                />
                <Paging defaultPageSize={5} />

                <Toolbar>
                    <Item name="groupPanel" />
                    <Item location="before">
                        <p className="text-md text-neutral-500 text-lg font-semibold">
                            Lesson previews
                        </p>
                    </Item>
                    <Item name="addRowButton" showText="always" />
                    <Item name="exportButton" />
                    <Item name="columnChooserButton" />
                    <Item name="searchPanel" />
                </Toolbar>
            </DataGrid>
        </div>
    )
}