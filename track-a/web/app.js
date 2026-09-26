const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const money = n => currency.format(n);
const text = (tag, value, className = '') => {
  const node = document.createElement(tag);
  node.textContent = value;
  node.className = className;
  return node;
};

async function refresh() {
  const status = document.querySelector('#status').value;
  const customerElem = document.querySelector('#customer');
  const customerId = customerElem ? customerElem.value : '';
  let url = `/api/invoices?status=${status}`;
  let exportUrl = `/api/export?status=${status}`;
  if (customerId) {
    url += `&customer_id=${encodeURIComponent(customerId)}`;
    exportUrl += `&customer_id=${encodeURIComponent(customerId)}`;
  }
  const exportBtn = document.querySelector('#export-btn');
  if (exportBtn) {
    exportBtn.href = exportUrl;
  }

  const responses = await Promise.all([fetch('/api/overview'), fetch(url)]);
  if (responses.some(r => !r.ok)) throw new Error('Could not refresh the register.');
  const [data, rows] = await Promise.all(responses.map(r => r.json()));
  document.querySelector('#invoice-count').textContent = data.summary.invoice_count;
  document.querySelector('#open-count').textContent = data.summary.open_count;
  document.querySelector('#outstanding').textContent = money(data.summary.outstanding);
  const body = document.querySelector('#invoices');
  body.replaceChildren();
  rows.forEach(r => {
    const row = document.createElement('tr');
    [r.customer_name, r.invoice_number, r.due_date].forEach(v => row.append(text('td', v)));
    [r.amount, r.paid, r.balance].forEach(v => row.append(text('td', money(v), 'number')));
    row.append(text('td', r.status));
    body.append(row);
  });
  const unmatched = document.querySelector('#unmatched');
  unmatched.replaceChildren(...data.unmatched_payments.map(p => text('li', `${p.payment_id} · ${p.customer_id} / ${p.invoice_number} · ${money(p.amount)}`)));
  if (!data.unmatched_payments.length) unmatched.append(text('li', 'No unmatched payments.'));
  document.querySelector('#page-error').textContent = '';
}

async function submitImport(form) {
  const feedback = form.querySelector('.feedback');
  const button = form.querySelector('button');
  const fileInput = form.querySelector('input');
  if (!fileInput.files.length) {
    feedback.textContent = 'Please select a CSV file.';
    return;
  }
  button.disabled = true;
  feedback.textContent = 'Importing…';
  try {
    const csv = await fileInput.files[0].text();
    const res = await fetch(`/api/import?kind=${form.dataset.kind}`, {
      method: 'POST', headers: { 'Content-Type': 'text/csv' }, body: csv
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Import failed');
    }
    let msg = `Import complete: ${data.imported} imported, ${data.skipped} skipped, ${data.rejected} rejected.`;
    if (data.errors && data.errors.length) {
      const errList = data.errors.map(e => `Line ${e.line}: ${e.reason}`).join(' | ');
      msg += ` Errors: ${errList}`;
    }
    feedback.textContent = msg;
    await refresh();
  } catch (error) {
    feedback.textContent = `Import failed: ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

document.querySelector('#status').addEventListener('change', () => refresh().catch(e => { document.querySelector('#page-error').textContent = e.message; }));
const custElem = document.querySelector('#customer');
if (custElem) {
  custElem.addEventListener('change', () => refresh().catch(e => { document.querySelector('#page-error').textContent = e.message; }));
}
document.querySelectorAll('form[data-kind]').forEach(form => form.addEventListener('submit', e => { e.preventDefault(); submitImport(form); }));
refresh().catch(e => { document.querySelector('#page-error').textContent = e.message; });
