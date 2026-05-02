import { SystemModule, PermissionLevels } from './types';

export const SYSTEM_MODULES: SystemModule[] = [
  { id: 'dashboard', label: 'Procurement Dashboard', icon: 'layout-dashboard' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  {
    id: 'pr_po', label: 'PR & PO Management', icon: 'shopping-cart',
    subItems: [
      { id: 'purchase_request', label: 'Purchase Request (PR)' },
      { id: 'purchase_order', label: 'Purchase Order (PO)' },
      { id: 'approval_workflow', label: 'Approval Workflow' }
    ]
  },
  {
    id: 'vendors', label: 'Vendor Hub', icon: 'building-2',
    subItems: [
      { id: 'supplier_directory', label: 'Supplier Directory' },
      { id: 'sla_rating', label: 'SLA & Rating' },
      { id: 'strategic_contracts', label: 'Strategic Contracts' },
      { id: 'scar_system', label: 'SCAR System' }
    ]
  },
  {
    id: 'analytics', label: 'Spend Analytics', icon: 'bar-chart-2',
    subItems: [
      { id: 'cost_savings', label: 'Cost Savings Report' },
      { id: 'supply_chain_risk', label: 'Supply Chain Risk' },
      { id: 'spend_category', label: 'Spend by Category' }
    ]
  },
  {
    id: 'inventory', label: 'Inventory & MES', icon: 'factory',
    subItems: [
      { id: 'goods_receiving', label: 'Goods Receiving (GR)' },
      { id: 'quality_inspection', label: 'Quality Inspection' },
      { id: 'critical_stock', label: 'Critical Stock Levels' }
    ]
  },
  {
    id: 'evaluations', label: 'Evaluations', icon: 'clipboard-list',
    subItems: [
      { id: 'selection_criteria', label: 'Selection Criteria' },
      { id: 'new_vendor_selection', label: 'New Vendor Selection' },
      { id: 'periodic_evaluation', label: 'Periodic Evaluation' },
      { id: 'evaluation_analysis', label: 'Evaluation Analysis' }
    ]
  },
  {
    id: 'audit', label: 'Audit & Compliance', icon: 'shield-check',
    subItems: [
      { id: 'supplier_audit', label: 'Supplier Audit' },
      { id: 'audit_checklist', label: 'Audit Checklist' },
      { id: 'audit_plan', label: 'Audit Plan' }
    ]
  },
  {
    id: 'risk_management', label: 'Risk Management', icon: 'alert-circle',
    subItems: [
      { id: 'material_risk', label: 'Material Risk Assessment' },
      { id: 'supplier_risk_mgmt', label: 'Supplier Risk Assessment' }
    ]
  },
  {
    id: 'finance', label: 'Finance & VAT', icon: 'dollar-sign',
    subItems: [
      { id: 'vat_tracking', label: 'VAT Tracking' },
      { id: 'payment_status', label: 'Payment Status' },
      { id: 'expense_claims', label: 'Expense Claims' }
    ]
  },
  {
    id: 'master_data', label: 'Master Data', icon: 'file-text',
    subItems: [
      { id: 'categories_config', label: 'Categories Config' },
      { id: 'master_item', label: 'Master Item' }
    ]
  },
  { 
    id: 'settings', label: 'Settings', icon: 'settings',
    subItems: [
      { id: 'user_permission', label: 'User Permission' },
      { id: 'dev_permit', label: 'Dev Permit (BETA)' },
      { id: 'system_config', label: 'System Config' },
      { id: 'access_logs', label: 'Access Logs' }
    ]
  }
];

export const PERMISSION_LEVELS: PermissionLevels[] = [
  { level: 0, label: 'No Access', icon: 'ban', color: '#7188a2', bg: '#e9e4dc' },
  { level: 1, label: 'Viewer', icon: 'eye', color: '#5686bb', bg: '#cfe0e7' },
  { level: 2, label: 'Editor', icon: 'edit', color: '#db9e32', bg: '#f2b33d40' },
  { level: 3, label: 'Verifier', icon: 'check-square', color: '#003049', bg: '#a0b1dd' },
  { level: 4, label: 'Approver', icon: 'award', color: '#849e51', bg: '#597d4f40' },
];
