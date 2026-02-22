// ERPNext/Frappe API layer - ready for integration
import { getERPNextConfig, DOCTYPE_MAPPING } from './erpnext-config';

interface FrappeResponse<T = unknown> {
  data: T;
  message?: string;
}

async function frappeCall<T>(method: string, params?: Record<string, unknown>): Promise<FrappeResponse<T>> {
  const config = getERPNextConfig();
  if (!config.enabled || !config.serverUrl) {
    throw new Error('ERPNext غير مفعل أو لم يتم تكوينه');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `token ${config.apiKey}:${config.apiSecret}`,
  };

  const response = await fetch(`${config.serverUrl}/api/method/${method}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) throw new Error(`ERPNext API Error: ${response.status}`);
  return response.json();
}

export async function testConnection(): Promise<boolean> {
  try {
    await frappeCall('frappe.auth.get_logged_user');
    return true;
  } catch {
    return false;
  }
}

export async function syncToERPNext(tableName: keyof typeof DOCTYPE_MAPPING, data: Record<string, unknown>): Promise<unknown> {
  const mapping = DOCTYPE_MAPPING[tableName];
  return frappeCall('frappe.client.insert', {
    doc: { doctype: mapping.doctype, ...transformToERPNext(tableName, data) },
  });
}

export async function syncFromERPNext(tableName: keyof typeof DOCTYPE_MAPPING, filters?: Record<string, unknown>): Promise<unknown[]> {
  const mapping = DOCTYPE_MAPPING[tableName];
  const result = await frappeCall<unknown[]>('frappe.client.get_list', {
    doctype: mapping.doctype,
    filters,
    limit_page_length: 0,
  });
  return result.data;
}

function transformToERPNext(tableName: string, data: Record<string, unknown>): Record<string, unknown> {
  // Transform data from our format to ERPNext format
  const transforms: Record<string, (d: Record<string, unknown>) => Record<string, unknown>> = {
    purchase_orders: (d) => ({
      supplier: d.vendor_name,
      transaction_date: d.created_at,
      grand_total: d.total_amount,
    }),
    vendors: (d) => ({
      supplier_name: d.name,
      tax_id: d.tax_number,
      supplier_group: 'All Supplier Groups',
    }),
    inventory_items: (d) => ({
      item_code: d.code,
      item_name: d.name,
      item_group: d.category || 'All Item Groups',
      stock_uom: d.unit || 'Nos',
    }),
    trucks: (d) => ({
      license_plate: d.plate_number,
      model: d.model,
      make: d.type,
    }),
    drivers: (d) => ({
      employee_name: d.name,
      cell_phone: d.phone,
    }),
  };

  return transforms[tableName]?.(data) ?? data;
}

export function transformFromERPNext(tableName: string, data: Record<string, unknown>): Record<string, unknown> {
  // Transform data from ERPNext format to our format
  const transforms: Record<string, (d: Record<string, unknown>) => Record<string, unknown>> = {
    purchase_orders: (d) => ({
      vendor_name: d.supplier,
      total_amount: d.grand_total,
      status: d.status,
    }),
    vendors: (d) => ({
      name: d.supplier_name,
      tax_number: d.tax_id,
    }),
    inventory_items: (d) => ({
      code: d.item_code,
      name: d.item_name,
      category: d.item_group,
    }),
  };

  return transforms[tableName]?.(data) ?? data;
}
