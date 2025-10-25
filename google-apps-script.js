/**
 * Google Apps Script for Tool Inventory Integration
 *
 * Setup Instructions:
 * 1. Create a Google Sheet with columns: ID | Item Name | Box Number | Quantity | Notes
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone" (or "Anyone with Google account" for more security)
 * 8. Click "Deploy"
 * 9. Copy the Web App URL and paste it in your app's Settings > Google Sheets URL
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'getAll') {
      // Read all items from the sheet
      return getAllItems(sheet);
    } else if (action === 'updateAll') {
      // Write all items to the sheet (replaces existing data)
      return updateAllItems(sheet, data.items);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action: ' + action
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getAllItems(sheet) {
  try {
    const lastRow = sheet.getLastRow();

    // If only header row exists, return empty array
    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        items: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get all data (skip header row)
    const range = sheet.getRange(2, 1, lastRow - 1, 5);
    const values = range.getValues();

    const items = values
      .filter(row => row[0] !== '') // Filter out empty rows
      .map(row => ({
        id: row[0],
        name: row[1],
        box: row[2].toString(),
        quantity: row[3].toString(),
        notes: row[4] || ''
      }));

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      items: items
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Failed to read items: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function updateAllItems(sheet, items) {
  try {
    // Clear all existing data except header
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 5).clear();
    }

    // Ensure header row exists
    const headers = sheet.getRange(1, 1, 1, 5).getValues()[0];
    if (!headers[0]) {
      sheet.getRange(1, 1, 1, 5).setValues([['ID', 'Item Name', 'Box Number', 'Quantity', 'Notes']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    // If no items to write, we're done
    if (!items || items.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Sheet cleared'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Convert items to 2D array for batch write
    const rows = items.map(item => [
      item.id,
      item.name,
      item.box,
      item.quantity,
      item.notes || ''
    ]);

    // Write all items at once (much faster than row-by-row)
    sheet.getRange(2, 1, rows.length, 5).setValues(rows);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `Updated ${items.length} items`
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Failed to update items: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests for testing
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Tool Inventory API is running! Use POST requests to sync data.',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Test function to verify the script works
 * Run this from the Apps Script editor to test
 */
function testGetAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const result = getAllItems(sheet);
  Logger.log(result.getContent());
}
