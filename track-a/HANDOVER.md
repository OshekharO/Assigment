# Handover

- Name: Saksham Shekher
- Email used for this application: omeepd009@gmail.com
- Chosen track: Track A (Repair the register)
- Why this track: I selected Track A because auditing, diagnosing, and repairing a real product engineering codebase with data integrity and financial accuracy constraints closely matches core product engineering work.
- Approximate total time, including setup and handover: 2 hours 15 minutes

## Run and verify

Requires Python 3.10+ and a standard browser. No extra dependencies required.

```bash
# 1. Start application
cd track-a
python3 app.py

# 2. Run existing smoke tests
python3 -m unittest discover -s tests -v

# 3. Restore and verify owner's register fixture
python3 restore_fixture.py --replace
python3 app.py
```

## What I delivered

Investigated and resolved all 6 core defects in ClearLedger while strictly preserving existing customer, invoice, and payment records.

1. **Payment Matching (`ledger/matching.py`)**: Fixed `find_invoice` which previously matched payments by amount alone before checking exact customer/invoice identity. It now matches strictly on exact `(customer_id, invoice_number)`.
2. **Re-import Deduplication (`ledger/storage.py`)**: Updated `insert_invoice` and `insert_payment` to skip identical re-imports without modifying totals, and reject reused keys/IDs with conflicting details.
3. **Status Filter (`ledger/reporting.py`)**: Fixed `invoices()` where `status='open'` was returning paid invoices instead of open invoices due to an inverted mapping dict.
4. **CSV Export Precision (`ledger/reporting.py`)**: Replaced `int(val * 100) / 100` float truncation with exact two-decimal string formatting (`f"{val:.2f}"`), eliminating rounding errors (e.g., `19.99` exported as `19.98`).
5. **Row-Level Error Isolation (`ledger/importing.py`)**: Refactored `import_csv()` loop to process each CSV row independently. Bad data rows increment `rejected` count and log line numbers/reasons without aborting valid rows.
6. **Browser Feedback (`web/app.js`)**: Updated `submitImport` to parse JSON API responses, display imported/skipped/rejected counts, and list line-by-line error messages on the UI.

### Product Improvement
Added **Customer Filtering** (`customer_id`) to `GET /api/invoices`, `GET /api/export`, and the browser register view. Business owners can now filter invoices by customer (e.g. `HARBOR`, `MAPLE`, `NORTH`) alongside invoice status and export customer-specific CSV reports.

## Evidence and limits

- **Existing Register Preservation**: Verified against `fixtures/expected-records.json` after running `restore_fixture.py --replace`. The restored database accurately maintained 9 invoices, 5 payments, 7 open invoices, INR 3,698.19 outstanding, and 1 unmatched payment. Successfully imported new valid invoices/payments and confirmed persistence across app restarts.
- **Failing-Before / Passing-After**:
  - Payment matching: Importing payment `MAPLE / INV-200 / 1250.00` previously assigned payment to `HARBOR / INV-100` because `INV-100` matched the amount first. After fix, payment correctly attaches to `MAPLE / INV-200`.
  - CSV export: `NORTH / INV-300` (INR 19.99) previously exported as `19.98`. After fix, exported as `19.99`.
- **Known limits / Assumptions**: Assumed customer creation remains out of scope. Handled single-user concurrency as specified in `BUSINESS_RULES.md`.

## Tools and judgment

- **AI Code Analysis -> Decision**: AI suggested adding database unique constraints for `(customer_id, invoice_number)`. I decided to handle deduplication in `insert_invoice` application code to maintain 100% schema compatibility with existing SQLite fixtures without requiring complex schema migrations.
- **Verification**: Verified using Python runtime scripts, `unittest`, and manual HTTP requests.
