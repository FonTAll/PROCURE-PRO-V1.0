import { SystemConfigData, ConfigTabId } from './types';

export const INITIAL_DATA: SystemConfigData = {
  departments: [
    { id: 1, name: 'Management', code: 'MGT' },
    { id: 2, name: 'Human Resources', code: 'HR' },
    { id: 3, name: 'Information Technology', code: 'IT' },
    { id: 4, name: 'Production', code: 'PROD' },
    { id: 5, name: 'Quality Assurance', code: 'QA' },
    { id: 6, name: 'Quality Control', code: 'QC' },
    { id: 7, name: 'Warehouse', code: 'WH' },
  ],
  categories: [
    { id: 1, name: 'Sausage' },
    { id: 2, name: 'Meatball' },
    { id: 3, name: 'Bologna' },
    { id: 4, name: 'Ham' },
    { id: 5, name: 'Sliced' },
    { id: 6, name: 'Loaf' },
    { id: 7, name: 'Batter' },
    { id: 8, name: 'SFG' },
    { id: 9, name: 'NPD' },
  ],
  brands: [
    { id: 1, name: 'AFM' },
    { id: 2, name: 'CJ' },
    { id: 3, name: 'ARO' },
    { id: 4, name: 'MAKRO' },
    { id: 5, name: 'Betagro' },
    { id: 6, name: 'Generic' },
    { id: 7, name: 'No Brand' },
    { id: 8, name: 'Internal' },
    { id: 9, name: 'Test' },
  ],
  customers: [
    { id: 1, name: 'Makro' },
    { id: 2, name: 'CP All' },
    { id: 3, name: 'Lotus' },
    { id: 4, name: 'Big C' },
    { id: 5, name: 'Tops' },
    { id: 6, name: 'Foodland' },
    { id: 7, name: 'MaxValu' },
    { id: 8, name: 'CJ Express' },
  ],
  pdfTemplates: [
    { id: 1, name: 'DAR FORM', dept: 'DC CENTER', code: 'FM-DC01-01', revision: 'REV. 02' },
    { id: 2, name: 'DESTRUCTION REPORT', dept: 'DC CENTER', code: 'FM-DC03-01', revision: 'REV. 01' },
    { id: 3, name: 'DISTRIBUTION REPORT', dept: 'DC CENTER', code: 'FM-DC04-01', revision: 'REV. 01' },
  ],
  idFormats: [
    {
      id: 1,
      pages: ['Plan from Planning', 'Production Planning'],
      prefix: 'PL',
      format: 'YYMMDD',
      sequenceDigit: 3,
      reset: 'Daily',
      note: 'Replacement format: PLYYMMDD/R.1'
    },
    {
      id: 2,
      pages: ['Daily Problem'],
      prefix: 'DF',
      format: 'YYMMDD',
      sequenceDigit: 3,
      reset: 'Daily',
      note: ''
    }
  ]
};

export const TABS: { id: ConfigTabId, label: string, icon: string, title: string, desc: string }[] = [
  { id: 'departments', label: 'Departments', icon: 'building-2', title: 'Departments', desc: 'Manage department list and codes used across the system.' },
  { id: 'categories', label: 'Category & Sub-Cat', icon: 'layers', title: 'Categories', desc: 'Manage product categories and sub-categories.' },
  { id: 'brands', label: 'Brand', icon: 'tag', title: 'Brands', desc: 'Manage product brands and OEM partners.' },
  { id: 'customers', label: 'Customer', icon: 'users', title: 'Customers', desc: 'Manage customer and client list.' },
  { id: 'pdfTemplates', label: 'PDF Templates', icon: 'printer', title: 'PDF FORM TEMPLATES', desc: 'Manage header details, codes, and revisions for system-generated PDF forms.' },
  { id: 'idFormats', label: 'ID Formats', icon: 'barcode', title: 'ID FORMAT CONFIGURATION', desc: 'Configure system-wide ID generation formats.' }
];

export const AVAILABLE_PAGES = ['Plan from Planning', 'Production Planning', 'Daily Problem', 'Master Item', 'Equipment Registry', 'STD Process'];
