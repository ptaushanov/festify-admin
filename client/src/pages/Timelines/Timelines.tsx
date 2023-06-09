import DataGrid, {
    SearchPanel,
    Column,
    HeaderFilter,
    Pager,
    Paging,
    Toolbar,
    Item,
} from "devextreme-react/data-grid";
import trpc from "../../services/trpc";
import { useRef, useState } from "react";
import ImageCell from "./components/ImageCell";
import { CellDblClickEvent } from "devextreme/ui/data_grid";

import { LightBulbIcon } from "@heroicons/react/24/outline"
import LessonEditModal from "./components/LessonEditModal";

type Season = "spring" | "summer" | "autumn" | "winter";

type Holiday = {
    id: number;
    celebrated_on: string;
    name: string;
    thumbnail: string;
}

export default function Timelines() {
    const [selectedSeason, setSelectedSeason] = useState<Season>("spring");
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const modalRef = useRef<HTMLDialogElement>(null);

    const pageSizes = [5, 10, 20]

    const { data } = trpc.timeline.getSeasonTimeline
        .useQuery({ season: selectedSeason });

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value as Season);
    }

    const handleTimelineLessonChange = (event: CellDblClickEvent<Holiday, any>) => {
        const { data } = event
        setSelectedHoliday(data)
        modalRef.current?.showModal()
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-3xl font-bold">
                    Timelines
                </h1>
                <select
                    onChange={handleSeasonChange}
                    className="select select-bordered w-52"
                    value={selectedSeason}
                >
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="autumn">Autumn</option>
                    <option value="winter">Winter</option>
                </select>
            </div>

            <DataGrid
                dataSource={data?.holidays.map((holiday, id) => ({ ...holiday, id }))}
                rowAlternationEnabled
                focusedRowEnabled
                showBorders
                keyExpr="id"
                columnAutoWidth
                allowColumnResizing
                className="card p-4 rounded-md shadow-sm bg-base-100 mt-10 w-full"
                onCellDblClick={handleTimelineLessonChange}
            >
                <HeaderFilter visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} width={200} />
                <Column dataField="celebrated_on" dataType="string" />
                <Column dataField="name" dataType="string" />
                <Column
                    dataField="thumbnail"
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
                />
                <Paging defaultPageSize={5} />

                <Toolbar>
                    <Item name="groupPanel" />
                    <Item location="before">
                        <p className="text-md text-neutral-500 text-[1rem] font-semibold">
                            Lesson previews
                        </p>
                    </Item>
                    <Item name="addRowButton" showText="always" />
                    <Item name="exportButton" />
                    <Item name="columnChooserButton" />
                    <Item name="searchPanel" />
                </Toolbar>
            </DataGrid>

            <div className="divider">
                <div className="flex items-center space-x-2 text-neutral-400">
                    <LightBulbIcon className="h-4 w-4" />
                    <p>Tip: Double click a lesson to edit it</p>
                </div>
            </div>

            {/* Modal */}
            <LessonEditModal
                modalRef={modalRef}
                holiday={selectedHoliday}
                season={selectedSeason}
            />
        </div >
    )
}