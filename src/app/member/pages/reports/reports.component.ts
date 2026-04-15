import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColDef, RowClassRules } from 'ag-grid-community';
import { DataGridComponent } from '../../../shared/components/data-grid/data-grid.component';
import { memberIcons } from '../../member-icons';

interface ReportRow {
  round: string;
  investment: string;
  profitFrom25: string;
  settlement: string;
  interest: string;
  total: string;
  isNoteRow?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-reports',
  imports: [CommonModule, FontAwesomeModule, DataGridComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  readonly reportsIcon = memberIcons.reports;
  readonly columnDefs: ColDef<ReportRow>[] = [
    { field: 'round', headerName: 'Rounds', minWidth: 100 },
    { field: 'investment', headerName: 'Investment', minWidth: 140 },
    { field: 'profitFrom25', headerName: 'Profit From (25%)', minWidth: 180 },
    { field: 'settlement', headerName: 'Settlement', minWidth: 140 },
    { field: 'interest', headerName: 'Interest', minWidth: 160 },
    { field: 'total', headerName: 'Total', minWidth: 140 }
  ];
  readonly rowClassRules: RowClassRules<ReportRow> = {
    'usm-grid-note-row': (params) => Boolean(params.data?.isNoteRow)
  };
  private readonly fixedInvestmentAmount = 500000;
  private readonly baseInvestmentAmount = 250000;

  private readonly baseRows: ReportRow[] = [
    { round: '1', investment: '250000', profitFrom25: '62500', settlement: '312500', interest: '0', total: '312500' },
    { round: '2', investment: '250000', profitFrom25: '67500', settlement: '317500', interest: '5000', total: '322500' },
    { round: '3', investment: '250000', profitFrom25: '72500', settlement: '322500', interest: '10000', total: '332500' },
    { round: '4', investment: '250000', profitFrom25: '77500', settlement: '327500', interest: '15000', total: '342500' },
    { round: '5', investment: '250000', profitFrom25: '82500', settlement: '332500', interest: '20000', total: '352500' },
    { round: '', investment: '', profitFrom25: 'HIKE 12500', settlement: '', interest: 'INTEREST 3% 7500', total: '', isNoteRow: true },
    { round: '6', investment: '250000', profitFrom25: '95000', settlement: '345000', interest: '25000', total: '370000' },
    { round: '7', investment: '250000', profitFrom25: '100000', settlement: '350000', interest: '32500', total: '382500' },
    { round: '8', investment: '250000', profitFrom25: '105000', settlement: '355000', interest: '40000', total: '395000' },
    { round: '9', investment: '250000', profitFrom25: '110000', settlement: '360000', interest: '47500', total: '407500' },
    { round: '10', investment: '250000', profitFrom25: '115000', settlement: '365000', interest: '55000', total: '420000' },
    { round: '', investment: '', profitFrom25: 'HIKE 12500', settlement: '', interest: 'INTEREST 4% 10000', total: '', isNoteRow: true },
    { round: '11', investment: '250000', profitFrom25: '127500', settlement: '377500', interest: '62500', total: '440000' },
    { round: '12', investment: '250000', profitFrom25: '132500', settlement: '382500', interest: '72500', total: '455000' },
    { round: '13', investment: '250000', profitFrom25: '137500', settlement: '387500', interest: '82500', total: '470000' },
    { round: '14', investment: '250000', profitFrom25: '142500', settlement: '392500', interest: '92500', total: '485000' },
    { round: '15', investment: '250000', profitFrom25: '147500', settlement: '397500', interest: '102500', total: '500000' },
    { round: '', investment: '', profitFrom25: 'HIKE 12500', settlement: '', interest: 'INTEREST 5% 12500', total: '', isNoteRow: true },
    { round: '16', investment: '250000', profitFrom25: '160000', settlement: '410000', interest: '112500', total: '522500' },
    { round: '17', investment: '250000', profitFrom25: '165000', settlement: '415000', interest: '125000', total: '540000' },
    { round: '18', investment: '250000', profitFrom25: '170000', settlement: '420000', interest: '137500', total: '557500' },
    { round: '19', investment: '250000', profitFrom25: '175000', settlement: '425000', interest: '150000', total: '575000' },
    { round: '20', investment: '250000', profitFrom25: '180000', settlement: '430000', interest: '162500', total: '592500' }
  ];

  readonly rows: ReportRow[] = this.baseRows.map((row) => this.scaleRow(row));

  private scaleRow(row: ReportRow): ReportRow {
    if (row.isNoteRow) {
      return {
        ...row,
        investment: this.scaleAmount(row.investment),
        profitFrom25: this.scaleEmbeddedAmount(row.profitFrom25),
        settlement: this.scaleAmount(row.settlement),
        interest: this.scaleEmbeddedAmount(row.interest),
        total: this.scaleAmount(row.total)
      };
    }

    const profitFrom25 = this.calculateAmountFromInvestment(row.profitFrom25, row.investment);
    const interest = this.calculateAmountFromInvestment(row.interest, row.investment);
    const settlement = this.fixedInvestmentAmount + profitFrom25;
    const total = settlement + interest;

    return {
      ...row,
      investment: this.fixedInvestmentAmount.toString(),
      profitFrom25: profitFrom25.toString(),
      settlement: settlement.toString(),
      interest: interest.toString(),
      total: total.toString()
    };
  }

  private calculateAmountFromInvestment(value: string, sourceInvestment: string): number {
    const numericValue = Number(value);
    const numericInvestment = Number(sourceInvestment);

    if (!Number.isFinite(numericValue) || !Number.isFinite(numericInvestment) || numericInvestment === 0) {
      return 0;
    }

    const rate = numericValue / numericInvestment;
    return Math.round(this.fixedInvestmentAmount * rate);
  }

  private scaleAmount(value: string): string {
    if (!/^\d+$/.test(value)) {
      return value;
    }

    const scale = this.fixedInvestmentAmount / this.baseInvestmentAmount;
    return Math.round(Number(value) * scale).toString();
  }

  private scaleEmbeddedAmount(value: string): string {
    return value.replace(/(\d+)$/u, (match) => this.scaleAmount(match));
  }
}
