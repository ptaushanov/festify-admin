import DataGrid, {
    SearchPanel,
    Column,
    HeaderFilter,
    Pager,
    Paging
} from "devextreme-react/data-grid";
import trpc from "../../services/trpc";
import { useState } from "react";
import toast from "react-hot-toast";
import ImageCell from "./components/ImageCell";
import { CellDblClickEvent } from "devextreme/ui/data_grid";

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

    const pageSizes = [5, 10, 20]

    const { data } = trpc.timeline.getSeasonTimeline
        .useQuery(
            { season: selectedSeason },
            {
                onError: (error) => toast.error(error.message),
                refetchOnMount: "always",
                retry: 3,
                retryDelay: 1000
            }
        );

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(event.target.value as Season);
    }

    const handleTimelineLessonChange = (event: CellDblClickEvent<Holiday, any>) => {
        const { data } = event
        setSelectedHoliday(data)
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
                className="card p-4 rounded-md shadow-sm bg-base-100 mt-8"
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
            </DataGrid>

        </div>
    )
}