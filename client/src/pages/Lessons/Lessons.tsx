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

type Season = "spring" | "summer" | "autumn" | "winter";

export default function Timelines() {
    const [selectedSeason, setSelectedSeason] = useState<Season>("spring");
    const pageSizes = [5, 10, 20]

    const { data } = trpc.lesson.getLessonsBySeason
        .useQuery({ season: selectedSeason });

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value as Season);
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex flex-row justify-between items-baseline">
                <h1 className="text-3xl font-bold">
                    Lessons
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
                dataSource={data?.lessons}
                rowAlternationEnabled
                focusedRowEnabled
                showBorders
                keyExpr="id"
                columnAutoWidth
                allowColumnResizing
                className="card p-4 rounded-md shadow-sm bg-base-100 mt-10 w-full"
            >
                <HeaderFilter visible={true} />
                <SearchPanel visible={true} highlightCaseSensitive={true} width={200} />
                <Column dataField="holiday_name" dataType="string" />
                <Column dataField="xp_reward" dataType="number" />
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
        </div >
    )
}