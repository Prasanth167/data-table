import { useEffect, useRef, useState } from 'react'
import './DataTableComponent.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

function DataTableComponent() {
    const [tableData, setTableData] = useState([]);
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [filterInput, setFilterInput] = useState('');
    const op = useRef<OverlayPanel>(null);


    useEffect(() => {
        fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`).then((res) => {
            return res.json();
        }).then((res) => {
            setTableData(res.data);
        })
    }, [page])

    const onPageChange = (e: any) => {
        setPage(e.page + 1)
    }

    const toggleOverlay = (event: React.MouseEvent) => {
        op.current?.toggle(event);
    };

    const onSubmit = () => {
        const numToSelect = parseInt(filterInput, 10);
        if (!isNaN(numToSelect) && numToSelect > 0) {
            const selected = tableData.slice(0, numToSelect);
            setSelectedRows(selected);
        }
        op.current?.hide(); 
    };

    const titleHeaderTemplate = () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i
                className="pi pi-chevron-down"
                style={{ cursor: 'pointer' }}
                onClick={toggleOverlay}
            ></i>
            <span>Title</span>
        </div>
    );

    return (
        <>
            <DataTable
                paginator rows={12}
                value={tableData} tableStyle={{ minWidth: '50rem' }}
                onPage={onPageChange}
                lazy
                first={(page - 1) * 12}
                totalRecords={1000}
                selection={selectedRows}
                onSelectionChange={(e: any) => setSelectedRows(e.value)}
                selectionMode={rowClick ? 'checkbox' : 'multiple'}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header={titleHeaderTemplate}></Column>
                <Column field="place_of_origin" header="Origin"></Column>
                <Column field="artist_display" header="Display"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Start Date"></Column>
                <Column field="date_end" header="End Date"></Column>
            </DataTable>
            <OverlayPanel ref={op}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '200px' }}>
                    <InputText
                        placeholder="Select rows..."
                        value={filterInput}
                        onChange={(e) => setFilterInput(e.target.value)}
                    />
                    <Button label="Submit" className="p-button-sm" onClick={onSubmit} />
                </div>
            </OverlayPanel>
        </>
    )
}

export default DataTableComponent
