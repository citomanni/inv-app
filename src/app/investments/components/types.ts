export interface Investment {
  title: string;
  img: string;
  location_desc: string;
  categories: string;
  isOversuscribed: boolean;
  total_Units: number;
  targeted_IRR: string | number;
  targeted_Equity_Multiple: string | number;
}
