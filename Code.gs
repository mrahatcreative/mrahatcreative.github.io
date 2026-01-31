function doGet(e) {
  // Return projects from the "Projects" sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Projects");
  
  // If params are needed, e.g. ?action=getProjects
  if (e.parameter.action === "getProjects") {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Convert to array of objects
    const result = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase()] = row[index];
      });
      // Handle tags (comma separated)
      if (obj.tags) {
        obj.tags = obj.tags.split(',').map(t => t.trim());
      }
      return obj;
    });

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Default return
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "API Ready" }))
      .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Handle contact form submission
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Contacts");
    if (!sheet) {
      // Create if doesn't exist
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Contacts");
    }
    
    const params = e.parameter;
    const name = params.name;
    const email = params.email;
    const message = params.message;
    const ip = params.ip || '';
    const isp = params.isp || '';
    const device = params.device || '';
    const city = params.city || '';
    const country = params.country || '';
    
    sheet.appendRow([new Date(), name, email, message, ip, isp, device, city, country]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Message sent!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setup() {
  // Run this once to setup sheets
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("Projects")) {
    const sheet = ss.insertSheet("Projects");
    sheet.appendRow(["Title", "Desc", "Tags", "Category", "Image"]);
    // Add sample data
    sheet.appendRow(["Project Xenon", "AI Analysis", "AI, Python", "Engineering", "https://via.placeholder.com/800"]);
  }
  if (!ss.getSheetByName("Contacts")) {
    const sheet = ss.insertSheet("Contacts");
    sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
  }
}
