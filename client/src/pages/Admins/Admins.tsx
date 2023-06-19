import trpc from '../../services/trpc';
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-hot-toast";
import DataGrid, {
    Column,
    HeaderFilter,
    Item,
    Pager,
    Paging,
    SearchPanel,
    Toolbar
} from "devextreme-react/data-grid";

type Admin = {
    id: string
    username: string
    email?: string
}

export default function Admins() {
    const pageSizes = [5, 10, 20]
    const { data } = trpc.admin.getAllAdmins.useQuery()
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)

    const adminDeleteMutation = trpc.admin.deleteAdmin.useMutation()
    const trpcContext = trpc.useContext()

    const handleDeleteAdmin = () => {
        if (!selectedAdmin) return
        adminDeleteMutation.mutate(selectedAdmin.id, {
            onSuccess: ({ message }) => {
                trpcContext.admin.getAllAdmins.invalidate()
                toast.success(message)
            }
        })
    }

    const handleCreateAdminModalOpen = () => null

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-4xl font-bold">
                    Admins
                </h1>
                <button
                    onClick={handleCreateAdminModalOpen}
                    className="btn bg-base-100 border-base-300"
                >
                    <PlusIcon className="h-4 w-4" />
                </button>
            </div>

            <DataGrid
                dataSource={data}
                rowAlternationEnabled
                focusedRowEnabled
                showBorders
                keyExpr="id"
                columnAutoWidth
                allowColumnResizing
                className="card p-8 rounded-md shadow-sm bg-base-100 mt-10 w-full"
                onRowClick={({ data }) => setSelectedAdmin(data)}
            >
                <HeaderFilter visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} width={200} />
                <Column dataField="username" dataType="string" />
                <Column dataField="email" dataType="string" />

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
                            List of admins
                        </p>
                    </Item>
                    <Item location="after" visible={!!selectedAdmin}>
                        <a
                            className="btn btn-sm hover:btn-error"
                            title="Delete user"
                            onClick={handleDeleteAdmin}
                        >
                            <TrashIcon className="h-4 w-4" />
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