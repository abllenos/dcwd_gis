# Reports Setup Instructions

## How to Add Your Report Files

1. **Place your report files in this folder:**
   - Copy `report_1.pdf` and `report_2.pdf` (or any other report files) into this `/public/reports/` directory
   - The files should be accessible at `/reports/filename.pdf` from the web browser

2. **Update the report configuration:**
   - Open `src/components/Reports.tsx`
   - Modify the `availableReports` array to match your actual files
   - Update the file paths, names, and descriptions

## Current Configuration

The system is currently set up to handle these report files:
- `report_1.pdf` - Water Infrastructure Report
- `report_2.pdf` - System Performance Analysis

## File Structure Example

```
public/
  reports/
    report_1.pdf          <- Your first report file
    report_2.pdf          <- Your second report file
    additional_report.pdf  <- Any additional reports
    README.md             <- This file
```

## Updating Report Information

In `src/components/Reports.tsx`, update the `availableReports` array:

```typescript
const [availableReports] = useState<ReportFile[]>([
  {
    id: 1,
    fileName: 'report_1.pdf',           // Actual filename
    displayName: 'Your Report Title',   // Display name in the UI
    description: 'Report description',  // Brief description
    fileSize: '2.3 MB',                // File size
    uploadDate: '2024-09-20',          // Upload/creation date
    category: 'Infrastructure',         // Category for filtering
    filePath: '/reports/report_1.pdf'  // Path from public folder
  },
  // Add more reports as needed...
]);
```

## Features

- ✅ Direct file download
- ✅ File viewing in new tab
- ✅ Category-based filtering
- ✅ Responsive table display
- ✅ File size and date information
- ✅ Dark/Light theme support