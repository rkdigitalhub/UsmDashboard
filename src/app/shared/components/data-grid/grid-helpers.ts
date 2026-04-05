import { ColDef, ICellRendererParams } from 'ag-grid-community';

export interface GridAction<TData> {
  label: string;
  kind?: 'default' | 'success' | 'warning' | 'danger';
  onClick: (row: TData) => void;
}

export function createStatusColumn<TData>(field: keyof TData & string, headerName: string, successValues: string[] = []): ColDef<TData> {
  return {
    field: field as unknown as ColDef<TData>['field'],
    headerName,
    minWidth: 130,
    cellRenderer: (params: ICellRendererParams<TData>) => {
      const value = String(params.value ?? '--');
      const badge = document.createElement('span');
      badge.className = `usm-grid-status ${successValues.includes(value) ? 'success' : ''}`;
      badge.textContent = value;
      return badge;
    }
  };
}

export function createActionColumn<TData>(actions: GridAction<TData>[]): ColDef<TData> {
  return {
    headerName: 'Actions',
    sortable: false,
    filter: false,
    resizable: false,
    minWidth: Math.max(160, actions.length * 74),
    maxWidth: Math.max(180, actions.length * 82),
    pinned: undefined,
    cellRenderer: (params: ICellRendererParams<TData>) => {
      const container = document.createElement('div');
      container.className = 'usm-grid-actions';

      for (const action of actions) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `usm-grid-action ${action.kind ?? 'default'}`;
        button.textContent = action.label;
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (params.data) {
            action.onClick(params.data);
          }
        });
        container.appendChild(button);
      }

      return container;
    }
  };
}