import DataGrid, { Column, HeaderFilter, Item, Pager, Paging, SearchPanel, Toolbar } from "devextreme-react/data-grid";
import trpc from '../../services/trpc';
import ImageCell from "./components/ImageCell";
import { DocumentMinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-hot-toast";

type User = {
    id: string
    username: string
    xp: number
    current_lesson: string
    avatar?: string
}

export default function Users() {
    const pageSizes = [5, 10, 20]
    const { data } = trpc.user.getAllUsers.useQuery()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const userWipeDataMutation = trpc.user.wipeUserData.useMutation()
    const trpcContext = trpc.useContext()

    const handleDeleteUser = () => null
    const handleWipeUserData = () => {
        if (!selectedUser) return
        userWipeDataMutation.mutate(selectedUser.id, {
            onSuccess: ({ message }) => {
                trpcContext.user.getAllUsers.invalidate()
                toast.success(message)
            }
        })
    }

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
                onRowClick={({ data }) => setSelectedUser(data)}
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
                            List of users
                        </p>
                    </Item>
                    <Item location="after" visible={!!selectedUser}>
                        <a
                            className="btn btn-sm hover:btn-error"
                            title="Delete user"
                            onClick={handleDeleteUser}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </a>
                    </Item>
                    <Item location="after" visible={!!selectedUser}>
                        <a
                            className="btn btn-sm hover:btn-error"
                            title="Wipe user's data"
                            onClick={handleWipeUserData}
                        >
                            <DocumentMinusIcon className="h-4 w-4" />
                        </a>
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