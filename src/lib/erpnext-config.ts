// ERPNext/Frappe integration configuration
export interface ERPNextConfig {
  serverUrl: string;
  apiKey: string;
  apiSecret: string;
  enabled: boolean;
  syncMode: 'manual' | 'auto';
  syncIntervalMinutes: number;
}

export const DEFAULT_ERPNEXT_CONFIG: ERPNextConfig = {
  serverUrl: '',
  apiKey: '',
  apiSecret: '',
  enabled: false,
  syncMode: 'manual',
  syncIntervalMinutes: 30,
};

// DocType mapping between our system and ERPNext
export const DOCTYPE_MAPPING = {
  purchase_orders: { doctype: 'Purchase Order', nameField: 'po_number' },
  vendors: { doctype: 'Supplier', nameField: 'name' },
  inventory_items: { doctype: 'Item', nameField: 'code' },
  inventory_movements: { doctype: 'Stock Entry', nameField: 'id' },
  work_orders: { doctype: 'Maintenance Visit', nameField: 'wo_number' },
  trucks: { doctype: 'Vehicle', nameField: 'plate_number' },
  drivers: { doctype: 'Employee', nameField: 'name' },
} as const;

export function getERPNextConfig(): ERPNextConfig {
  const saved = localStorage.getItem('erpnext-config');
  if (saved) {
    try { return JSON.parse(saved); } catch { /* ignore */ }
  }
  return DEFAULT_ERPNEXT_CONFIG;
}

export function saveERPNextConfig(config: ERPNextConfig): void {
  localStorage.setItem('erpnext-config', JSON.stringify(config));
}
