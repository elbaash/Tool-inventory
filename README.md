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

### "Failed to fetch" error?

**IMPORTANT: You MUST create a NEW deployment, not update an existing one!**

1. In Apps Script, click **Deploy > New deployment** (NOT "Manage deployments")
2. Select type: **Web app**
3. Set **Execute as: Me**
4. Set **Who has access: Anyone**
5. Click **Deploy**
6. **Copy the NEW Web App URL** (it will be different from any old URL)
7. Paste the NEW URL into your app Settings
8. Save Settings and try again

### Testing your deployment:

1. Copy your Web App URL
2. Paste it in a browser address bar
3. You should see: `{"success":true,"message":"Tool Inventory API is running!...`
4. If you see this, your deployment works!

### Still not working?

- **Clear browser cache** and reload the app
- Make sure your Google Sheet has the header row: `ID | Item Name | Box Number | Quantity | Notes`
- Check browser console (F12) for detailed error messages
- Verify you're using the **exact** code from `google-apps-script.js`

### CORS errors?

- Make sure you used **"text/plain;charset=utf-8"** content-type (already set in the app)
- Always create a **NEW deployment** when you update the script
- The app should work without any CORS issues if deployed correctly
