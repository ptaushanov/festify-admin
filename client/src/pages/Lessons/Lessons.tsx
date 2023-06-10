import DataGrid, {
    SearchPanel,
    Column,
    HeaderFilter,
    Pager,
    Paging,
    Toolbar,
    Item
} from "devextreme-react/data-grid";
import trpc from "../../services/trpc";
import { useState } from "react";
import { LightBulbIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CellDblClickEvent } from 'devextreme/ui/data_grid';
import { useNavigate } from "react-router-dom";

type Season = "spring" | "summer" | "autumn" | "winter";

type LessonInfo = {
    id: string;
    holiday_name: string;
    xp_reward: number;
    page_count: number;
    question_count: number;
    has_reward: boolean;
}

export default function Lessons() {
    const [selectedSeason, setSelectedSeason] = useState<Season>("spring");
    const navigate = useNavigate()
    const pageSizes = [5, 10, 20]

    const { data } = trpc.lesson.getLessonsBySeason
        .useQuery({ season: selectedSeason });

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value as Season);
    }

    const handlePreviewLesson = (event: CellDblClickEvent<LessonInfo, unknown>) => {
        const { data } = event
        if (data) navigate(`/lessons/${selectedSeason}/${data.id}`)
    }

    const formatToXP = ({ value }: { value: number }) => `${value} XP`

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-3xl font-bold">
                    Lessons
                </h1>
                <div className="flex space-x-2">
                    <button className="btn bg-base-100 border-base-300">
                        <PlusIcon className="h-4 w-4" />
                    </button>
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
            </div>

            <DataGrid
                dataSource={data?.lessons}
                rowAlternationEnabled
                focusedRowEnabled
                showBorders
                keyExpr="id"
                columnAutoWidth
                allowColumnResizing
                className="card p-8 rounded-md shadow-sm bg-base-100 mt-10 w-full"
                onCellDblClick={handlePreviewLesson}
            >
                <HeaderFilter visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} width={200} />
                <Column dataField="holiday_name" dataType="string" />
                <Column dataField="xp_reward" dataType="number" customizeText={formatToXP} />
                <Column dataField="page_count" dataType="number" />
                <Column dataField="question_count" dataType="number" />
                <Column dataField="has_reward" dataType="boolean" />
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

            <div className="divider mt-6">
                <div className="flex items-center space-x-2 text-neutral-400">
                    <LightBulbIcon className="h-4 w-4" />
                    <p>Tip: Double click a lesson to preview it</p>
                </div>
            </div>
        </div >
    )
}