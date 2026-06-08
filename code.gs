// CA Client Document Reminder Automation
// Author: Varun Kumar

function sendReminders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var clientSheet = ss.getSheetByName("Clients");
  var logSheet = ss.getSheetByName("Logs");
  var today = new Date();

  var lastRow = clientSheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No clients found.");
    return;
  }

  var data = clientSheet.getRange(2, 1, lastRow - 1, 6).getValues();

  for (var i = 0; i < data.length; i++) {
    var clientName = data[i][0];
    var email = data[i][1];
    var docType = data[i][2];
    var status = data[i][3];

    // Skip empty rows
    if (!clientName || !email) continue;

    // Only send reminder if status is Pending or Overdue
    if (status === "Pending" || status === "Overdue") {
      
      // Email subject and body
      var subject = "Reminder: " + docType + " Submission Required – " + clientName;
      var body = "Dear " + clientName + ",\n\n" +
        "This is a reminder from our CA office.\n\n" +
        "We have not yet received your " + docType + ".\n" +
        "Kindly submit it at the earliest to avoid any delays in processing.\n\n" +
        "Current Status: " + status + "\n\n" +
        "If you have already submitted, please ignore this email.\n\n" +
        "Regards,\nCA Office Automation System";

      // Send email
      MailApp.sendEmail(email, subject, body);

      // Update Last Reminder Sent column (Column E)
      clientSheet.getRange(i + 2, 5).setValue(today);

      // Log the action
      logSheet.appendRow([
        today,
        clientName,
        email,
        "Reminder sent for: " + docType
      ]);

      Logger.log("Reminder sent to: " + clientName);
    }

    // If received, log it
    if (status === "Received") {
      logSheet.appendRow([
        today,
        clientName,
        email,
        "Document received — no reminder sent"
      ]);
    }
  }

  // Update Dashboard
  updateDashboard();
}

function updateDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var clientSheet = ss.getSheetByName("Clients");
  var dashSheet = ss.getSheetByName("Dashboard");

  var lastRow = clientSheet.getLastRow();
  var pending = 0, received = 0, overdue = 0;

  if (lastRow >= 2) {
    var data = clientSheet.getRange(2, 4, lastRow - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === "Pending") pending++;
      else if (data[i][0] === "Received") received++;
      else if (data[i][0] === "Overdue") overdue++;
    }
  }

  // Write to Dashboard
  dashSheet.clearContents();
  dashSheet.getRange("A1").setValue("CA Client Tracker — Dashboard");
  dashSheet.getRange("A3").setValue("Last Updated");
  dashSheet.getRange("B3").setValue(new Date());
  dashSheet.getRange("A5").setValue("Status");
  dashSheet.getRange("B5").setValue("Count");
  dashSheet.getRange("A6").setValue("Pending");
  dashSheet.getRange("B6").setValue(pending);
  dashSheet.getRange("A7").setValue("Received");
  dashSheet.getRange("B7").setValue(received);
  dashSheet.getRange("A8").setValue("Overdue");
  dashSheet.getRange("B8").setValue(overdue);
  dashSheet.getRange("A9").setValue("Total Clients");
  dashSheet.getRange("B9").setValue(pending + received + overdue);

  Logger.log("Dashboard updated.");
}

function setDailyTrigger() {
  // Run this once to set up daily automation
  ScriptApp.newTrigger("sendReminders")
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  Logger.log("Daily trigger set for 9 AM.");
}
