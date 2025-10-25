/**
 * Google Apps Script for Tool Inventory Integration
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'getAll') {
      return getAllItems(sheet);
    } else if (action === 'updateAll') {
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

    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        items: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const range = sheet.getRange(2, 1, lastRow - 1, 5);
    const values = range.getValues();

    const items = values
      .filter(row => row[0] !== '')
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
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 5).clear();
    }

    const headers = sheet.getRange(1, 1, 1, 5).getValues()[0];
    if (!headers[0]) {
      sheet.getRange(1, 1, 1, 5).setValues([['ID', 'Item Name', 'Box Number', 'Quantity', 'Notes']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    if (!items || items.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Sheet cleared'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const rows = items.map(item => [
      item.id,
      item.name,
      item.box,
      item.quantity,
      item.notes || ''
    ]);

    sheet.getRange(2, 1, rows.length, 5).setValues(rows);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Updated ' + items.length + ' items'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Failed to update items: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Tool Inventory API is running! Use POST requests to sync data.',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * TEST FUNCTIONS - Run these from the Apps Script editor
 */

// Test reading items from the sheet
function testGetAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const result = getAllItems(sheet);
  Logger.log('GET ALL RESULT:');
  Logger.log(result.getContent());
}

// Test writing sample items to the sheet
function testUpdateAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const sampleItems = [
    { id: 1, name: 'Test Hammer', box: '10', quantity: '1', notes: 'Test item' },
    { id: 2, name: 'Test Drill', box: '5', quantity: '1', notes: 'Test item 2' }
  ];

  const result = updateAllItems(sheet, sampleItems);
  Logger.log('UPDATE ALL RESULT:');
  Logger.log(result.getContent());
}

// Test the complete flow
function testCompleteFlow() {
  Logger.log('=== TESTING COMPLETE FLOW ===');

  // First, write some test data
  Logger.log('1. Writing test data...');
  testUpdateAll();

  // Then, read it back
  Logger.log('2. Reading data back...');
  testGetAll();

  Logger.log('=== TEST COMPLETE ===');
}

