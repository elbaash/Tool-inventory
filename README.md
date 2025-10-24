# Tool Inventory Management App

AI-powered tool inventory with photo identification, voice batch entry, and Google Sheets integration.

## Features

- Search and browse your tool inventory
- Add/Edit/Delete items with box organization
- Google Sheets two-way sync
- AI photo identification (optional)
- AI voice batch entry (optional)
- Mobile-friendly PWA design

## Google Sheets Integration Setup

### Quick Start

1. **Create a Google Sheet** with these columns:
   - ID | Item Name | Box Number | Quantity | Notes

2. **Open Apps Script**:
   - In your Google Sheet, go to `Extensions > Apps Script`

3. **Add the Script**:
   - Delete any existing code
   - Copy all code from `google-apps-script.js` in this repo
   - Paste it into the Apps Script editor

4. **Deploy as Web App**:
   - Click `Deploy > New deployment`
   - Select type: `Web app`
   - Execute as: `Me`
   - Who has access: `Anyone` (or `Anyone with Google account`)
   - Click `Deploy`
   - Authorize the app when prompted
   - Copy the Web App URL

5. **Configure Your App**:
   - Open the inventory app
   - Go to Settings
   - Paste the Web App URL into "Google Sheets URL"
   - (Optional) Enable "Auto-sync changes to Google Sheets"
   - Click "Save Settings"

### Sync Options

- **Pull**: Load inventory FROM Google Sheets (overwrites local data)
- **Push**: Save your local inventory TO Google Sheets (overwrites sheet data)
- **Both**: Two-way sync (push then pull)
- **Auto-sync**: Automatically push changes to Sheets when you add/edit/delete items

## AI Features (Optional)

### Requirements
- RTX 3090 or similar GPU
- Ollama with llama3.1:8b model
- AI photo identification server

See the setup guide in the app for detailed instructions.

## Usage

1. Open `index.html` in your browser
2. Search for tools by name, box number, or notes
3. Add new items or browse by box
4. Sync with Google Sheets to keep your inventory backed up

## Troubleshooting

### Google Sheets sync not working?

- Make sure you deployed the Apps Script as a Web App
- Check that "Who has access" is set to "Anyone" in the deployment settings
- Verify the Web App URL is correct in Settings
- Check browser console for error messages
- Try clicking "Pull" first to test the connection

### CORS errors?

- Make sure you deployed the script as "Execute as: Me"
- Redeploy the Apps Script if you made changes
- Clear browser cache and try again
