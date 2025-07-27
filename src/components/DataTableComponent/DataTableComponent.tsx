 import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './DataTableComponent.css'

function DataTableComponent() {
    const [fullDataSet, setFullDataSet] = useState<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [filterInput, setFilterInput] = useState('');
    const op = useRef<OverlayPanel>(null);
    const rowsPerPage = 12;
 
    useEffect(() => {
        fetch("https://api.artic.edu/api/v1/artworks?page=1&limit=100")
            .then((res) => res.json())
            .then((res) => {
                const data = res.data;
                setFullDataSet(data);
                setTableData(data.slice(0, rowsPerPage));
            });
    }, []);

     
    const onPageChange = (e: any) => {
        setPage(e.page + 1);
        const start = e.page * rowsPerPage;
        const end = start + rowsPerPage;
        setTableData(fullDataSet.slice(start, end));
    };

   
    const toggleOverlay = (event: React.MouseEvent) => {
        op.current?.toggle(event);
    };

   
    const onSubmit = () => {
        const numToSelect = parseInt(filterInput, 10);
        if (!isNaN(numToSelect) && numToSelect > 0) {
            const selected = fullDataSet.slice(0, numToSelect);
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
                value={tableData}
                dataKey="id"
                paginator
                rows={rowsPerPage}
                first={(page - 1) * rowsPerPage}
                totalRecords={fullDataSet.length}
                onPage={onPageChange}
                tableStyle={{ minWidth: '50rem' }}
                lazy
                selection={selectedRows}
                onSelectionChange={(e: any) => setSelectedRows(e.value)}
                selectionMode="multiple"
            >
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: '3rem' }}
                />
                <Column field="title" header={titleHeaderTemplate} />
                <Column field="place_of_origin" header="Origin" />
                <Column field="artist_display" header="Display" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>

            <OverlayPanel ref={op}>
                <div
                     style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        width: '200px',
                    }}
                >
                    <InputText
                        placeholder="Select rows..."
                        value={filterInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSubmit();
                            }
                        }}
                        onChange={(e) => setFilterInput(e.target.value)}
                    />
                    <Button label="Submit" className="p-button-sm" onClick={onSubmit}
/>
                </div>
            </OverlayPanel>
        </>
    );
}

export default DataTableComponent;
