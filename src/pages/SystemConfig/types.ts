export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
}

export interface PdfTemplate {
  id: number;
  name: string;
  dept: string;
  code: string;
  revision: string;
}

export interface IdFormat {
  id: number;
  pages: string[];
  prefix: string;
  format: string;
  sequenceDigit: number;
  reset: string;
  note: string;
}

export interface SystemConfigData {
  departments: Department[];
  categories: Category[];
  brands: Brand[];
  customers: Customer[];
  pdfTemplates: PdfTemplate[];
  idFormats: IdFormat[];
}

export type ConfigTabId = keyof SystemConfigData;
