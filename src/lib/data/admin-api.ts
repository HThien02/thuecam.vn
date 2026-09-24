'use client';

export async function saveAdminRecord<T>(
  table: string,
  record: object,
  operation?: 'create' | 'update',
): Promise<T> {
  const response = await fetch('/api/admin/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ table, record, operation }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error ?? 'Không thể lưu dữ liệu.');
  return result as T;
}

export async function deleteAdminRecord(table: string, id: string): Promise<void> {
  const query = new URLSearchParams({ table, id });
  const response = await fetch(`/api/admin/data?${query}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error ?? 'Không thể xóa dữ liệu.');
  }
}
