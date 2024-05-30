import { Metadata } from "next";
import AddPanel from "./component/AddBox";
export const metadata: Metadata = {
    title: 'HCMUT | Vehicle',
}
const DataTablesPage = () => {

    return (
        <div className="mt-5 grid h-[calc(100dvh-208px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <AddPanel />
        </div>
    );
};

export default DataTablesPage;

