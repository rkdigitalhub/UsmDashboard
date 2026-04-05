import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileCsv, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  Module,
  RowClassRules,
  ValueFormatterParams,
  ValueGetterParams
} from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-data-grid',
  imports: [CommonModule, FontAwesomeModule, AgGridAngular],
  template: `
    <div class="usm-data-grid-shell">
      <div class="usm-data-grid-toolbar" *ngIf="enableExport">
        <div class="usm-data-grid-toolbar-copy">
          <span class="usm-data-grid-toolbar-title">Export</span>
          <span class="usm-data-grid-toolbar-meta">{{ rowData.length }} rows ready</span>
        </div>

        <div class="usm-data-grid-toolbar-actions">
          <button class="usm-data-grid-export-button" type="button" (click)="exportCsv()" [disabled]="!rowData.length">
            <fa-icon [icon]="csvIcon"></fa-icon>
            <span>CSV</span>
          </button>
          <button class="usm-data-grid-export-button" type="button" (click)="exportExcel()" [disabled]="!rowData.length">
            <fa-icon [icon]="excelIcon"></fa-icon>
            <span>Excel</span>
          </button>
          <button class="usm-data-grid-export-button" type="button" (click)="exportPdf()" [disabled]="!rowData.length">
            <fa-icon [icon]="pdfIcon"></fa-icon>
            <span>PDF</span>
          </button>
        </div>
      </div>

      <ag-grid-angular
        class="ag-theme-quartz usm-data-grid"
        [style.height]="height"
        [modules]="modules"
        [rowData]="rowData"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowClassRules]="rowClassRules"
        [pagination]="pagination"
        [paginationPageSize]="paginationPageSize"
        [domLayout]="domLayout"
        [rowHeight]="rowHeight"
        [headerHeight]="headerHeight"
        [animateRows]="true"
        [suppressCellFocus]="true"
        [overlayNoRowsTemplate]="noRowsText"
        (gridReady)="onGridReady($event)"
      ></ag-grid-angular>
    </div>
  `
})
export class DataGridComponent {
  readonly csvIcon = faFileCsv;
  readonly excelIcon = faFileExcel;
  readonly pdfIcon = faFilePdf;
  @Input({ required: true }) columnDefs: ColDef[] = [];
  @Input({ required: true }) rowData: unknown[] = [];
  @Input() rowClassRules?: RowClassRules;
  @Input() enableExport = false;
  @Input() exportFileName = 'grid-export';
  @Input() height = '320px';
  @Input() pagination = false;
  @Input() paginationPageSize = 10;
  @Input() domLayout: 'normal' | 'autoHeight' | 'print' = 'normal';
  @Input() rowHeight = 46;
  @Input() headerHeight = 44;
  @Input() noRowsText = '<span class="usm-grid-empty">No records available.</span>';
  readonly modules: Module[] = [ClientSideRowModelModule];
  private gridApi?: GridApi;

  readonly defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
    minWidth: 120,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    wrapText: true,
    autoHeight: false
  };

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
  }

  async exportCsv(): Promise<void> {
    const exportData = this.buildExportData();
    if (!exportData.rows.length) {
      return;
    }

    const csv = [exportData.headers, ...exportData.rows]
      .map((row) => row.map((value) => this.escapeCsvValue(value)).join(','))
      .join('\n');

    this.downloadBlob(csv, this.getFileName('csv'), 'text/csv;charset=utf-8;');
  }

  async exportExcel(): Promise<void> {
    const exportData = this.buildExportData();
    if (!exportData.rows.length) {
      return;
    }

    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.aoa_to_sheet([exportData.headers, ...exportData.rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');
    XLSX.writeFile(workbook, this.getFileName('xlsx'));
  }

  async exportPdf(): Promise<void> {
    const exportData = this.buildExportData();
    if (!exportData.rows.length) {
      return;
    }

    const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);

    const document = new jsPDF({
      orientation: exportData.headers.length > 6 ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    document.setFontSize(12);
    document.text(this.getReadableFileName(), 40, 36);

    autoTable(document, {
      head: [exportData.headers],
      body: exportData.rows,
      startY: 52,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 6,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [29, 24, 20],
        textColor: [255, 240, 202]
      },
      alternateRowStyles: {
        fillColor: [247, 244, 239]
      }
    });

    document.save(this.getFileName('pdf'));
  }

  private buildExportData(): { headers: string[]; rows: string[][] } {
    const columns = this.getExportableColumns();
    const rows = this.getRowsForExport().map((row) => columns.map((column) => this.formatExportValue(this.resolveColumnValue(column, row))));

    return {
      headers: columns.map((column) => column.headerName?.trim() || column.field || 'Column'),
      rows
    };
  }

  private getExportableColumns(): ColDef[] {
    const visibleColumns = this.gridApi?.getAllDisplayedColumns().map((column) => column.getColDef()) ?? this.columnDefs;
    return visibleColumns.filter((column) => this.isExportableColumn(column));
  }

  private getRowsForExport(): unknown[] {
    if (!this.gridApi) {
      return this.rowData;
    }

    const rows: unknown[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
      if (rowNode.data) {
        rows.push(rowNode.data);
      }
    });
    return rows;
  }

  private isExportableColumn(column: ColDef): boolean {
    return Boolean(column.field || column.valueGetter);
  }

  private resolveColumnValue(column: ColDef, row: unknown): unknown {
    const baseValue = this.resolveBaseValue(column, row);

    if (typeof column.valueFormatter === 'function') {
      return column.valueFormatter({
        value: baseValue,
        data: row,
        colDef: column,
        api: this.gridApi as never,
        node: undefined as never,
        column: undefined as never,
        context: undefined
      } as ValueFormatterParams);
    }

    return baseValue;
  }

  private resolveBaseValue(column: ColDef, row: unknown): unknown {
    if (typeof column.valueGetter === 'function') {
      return column.valueGetter({
        data: row,
        colDef: column,
        api: this.gridApi as never,
        context: undefined,
        getValue: (field: string) => this.readPathValue(row, field),
        node: undefined as never,
        column: undefined as never
      } as ValueGetterParams);
    }

    if (typeof column.field === 'string') {
      return this.readPathValue(row, column.field);
    }

    return undefined;
  }

  private readPathValue(source: unknown, field: string): unknown {
    if (!source || typeof source !== 'object') {
      return undefined;
    }

    return field.split('.').reduce<unknown>((current, segment) => {
      if (!current || typeof current !== 'object') {
        return undefined;
      }

      return (current as Record<string, unknown>)[segment];
    }, source);
  }

  private formatExportValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '--';
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.formatExportValue(item)).join(', ');
    }

    return String(value);
  }

  private escapeCsvValue(value: string): string {
    const escaped = value.replace(/"/g, '""');
    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
  }

  private downloadBlob(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  private getFileName(extension: string): string {
    const normalized = this.exportFileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'grid-export';

    return `${normalized}.${extension}`;
  }

  private getReadableFileName(): string {
    return this.exportFileName
      .trim()
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ') || 'Grid Export';
  }
}