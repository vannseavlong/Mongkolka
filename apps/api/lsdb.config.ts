export default {
  projectName: "api",
  superAdminEmail: "admin@suntel.io",
  actors: [
    {
      "name": "admin",
      "sheetIdEnv": "ADMIN_SHEET_ID"
    },
    {
      "name": "couple",
      "sheetIdEnv": "DEV_COUPLE_SHEET_ID"
    },
    {
      "name": "vendor",
      "sheetIdEnv": "DEV_VENDOR_SHEET_ID"
    }
  ],
  // Schema mismatch behaviour: 'warn' | 'error' | 'auto-sync'
  onSchemaMismatch: 'warn',
};
