import { 
  LayoutDashboard, 
  Calendar,
  ShoppingCart,
  Building2,
  BarChart2,
  Factory,
  ClipboardList,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  FileText,
  Settings,
  History,
  Users
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path?: string;
  name: string;
  icon?: any;
  isConfidential?: boolean;
  type?: 'header' | 'item';
  subItems?: { id: string; name: string; path?: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', path: '/', name: 'Procurement Dashboard', icon: LayoutDashboard, isConfidential: false, type: 'item' },
  { id: 'calendar', path: '/calendar', name: 'Calendar', icon: Calendar, isConfidential: false, type: 'item' },
  { id: 'operational_header', name: 'OPERATIONAL MODULES', type: 'header' },
  {
    id: 'pr_po', 
    path: '/pr-po',
    name: 'PR & PO Management', 
    icon: ShoppingCart,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'purchase_request', name: 'Purchase Request (PR)', path: '/pr' },
      { id: 'purchase_order', name: 'Purchase Order (PO)', path: '/po' },
      { id: 'approval_workflow', name: 'Approval Workflow', path: '/approval' }
    ]
  },
  {
    id: 'vendors', 
    path: '/vendors',
    name: 'Vendor Hub', 
    icon: Building2,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'supplier_directory', name: 'Supplier Directory', path: '/suppliers' },
      { id: 'sla_rating', name: 'SLA & Rating', path: '/sla' },
      { id: 'strategic_contracts', name: 'Strategic Contracts', path: '/contracts' },
      { id: 'scar_system', name: 'SCAR System', path: '/scar' }
    ]
  },
  {
    id: 'analytics', 
    path: '/analytics',
    name: 'Spend Analytics', 
    icon: BarChart2,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'cost_savings', name: 'Cost Savings Report', path: '/savings' },
      { id: 'supply_chain_risk', name: 'Supply Chain Risk', path: '/risk' },
      { id: 'spend_category', name: 'Spend by Category', path: '/category' }
    ]
  },
  {
    id: 'inventory', 
    path: '/inventory',
    name: 'Inventory & MES', 
    icon: Factory,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'goods_receiving', name: 'Goods Receiving (GR)', path: '/gr' },
      { id: 'quality_inspection', name: 'Quality Inspection', path: '/inspection' },
      { id: 'critical_stock', name: 'Critical Stock Levels', path: '/stock' }
    ]
  },
  {
    id: 'evaluations', 
    path: '/evaluations',
    name: 'Evaluations', 
    icon: ClipboardList,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'selection_criteria', name: 'Selection Criteria', path: '/criteria' },
      { id: 'new_vendor_selection', name: 'New Vendor Selection', path: '/vendor-selection' },
      { id: 'periodic_evaluation', name: 'Periodic Evaluation', path: '/periodic' },
      { id: 'evaluation_analysis', name: 'Evaluation Analysis', path: '/eval-analysis' }
    ]
  },
  {
    id: 'audit', 
    path: '/audit',
    name: 'Audit & Compliance', 
    icon: ShieldCheck,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'supplier_audit', name: 'Supplier Audit', path: '/supplier-audit' },
      { id: 'audit_checklist', name: 'Audit Checklist', path: '/checklist' },
      { id: 'audit_plan', name: 'Audit Plan', path: '/audit-plan' }
    ]
  },
  {
    id: 'risk_management', 
    path: '/risk-management',
    name: 'Risk Management', 
    icon: AlertCircle,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'material_risk', name: 'Material Risk Assessment', path: '/material-risk' },
      { id: 'supplier_risk_mgmt', name: 'Supplier Risk Assessment', path: '/supplier-risk' }
    ]
  },
  {
    id: 'finance', 
    path: '/finance',
    name: 'Finance & VAT', 
    icon: DollarSign,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'vat_tracking', name: 'VAT Tracking', path: '/vat' },
      { id: 'payment_status', name: 'Payment Status', path: '/payment' },
      { id: 'expense_claims', name: 'Expense Claims', path: '/expense' }
    ]
  },
  {
    id: 'master_data', 
    path: '/master-data',
    name: 'Master Data', 
    icon: FileText,
    isConfidential: false,
    type: 'item',
    subItems: [
      { id: 'categories_config', name: 'Categories Config', path: '/categories' },
      { id: 'master_code', name: 'CODE MASTER CONFIG', path: '/code-master' },
      { id: 'item_master', name: 'ITEM MASTER', path: '/items' }
    ]
  },
  { 
    id: 'settings', 
    path: '/settings',
    name: 'Settings', 
    icon: Settings,
    isConfidential: true,
    type: 'item',
    subItems: [
      { id: 'user_permission', name: 'User Permission', path: '/permissions' },
      { id: 'dev_permit', name: 'Dev Permit (BETA)', path: '/dev-permit' },
      { id: 'system_config', name: 'System Config', path: '/config' },
      { id: 'access_logs', name: 'Access Logs', path: '/access-logs' }
    ]
  }
];
