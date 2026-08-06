/**
 * AUTOMATED GOOGLE APPS SCRIPT FOR CRM DASHBOARD CREATION
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/15n6wstZajaR98ZzD5ZnV5tH6B8quAoCYTRD5CiH7h-M/edit
 * 2. In top menu click: Extensions > Apps Script
 * 3. Delete any code in the editor, paste this entire script, and click the Save icon.
 * 4. Select 'createCRMDashboard' and click "Run".
 * 
 * Result: Automatically creates and formats a complete 'Dashboard' tab with KPI Scorecards, 
 * Status Breakdown, Agent Performance, and Daily Lead Breakdown!
 */

function createCRMDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Find leads sheet (assumed to be named "leads", "Leads", or the first active sheet)
  var leadsSheet = ss.getSheetByName("leads") || ss.getSheetByName("Leads") || ss.getSheets()[0];
  var leadsSheetName = leadsSheet.getName();
  
  // Create or reset Dashboard sheet
  var dashSheet = ss.getSheetByName("Dashboard");
  if (dashSheet) {
    dashSheet.clear();
  } else {
    dashSheet = ss.insertSheet("Dashboard", 0);
  }
  
  dashSheet.setGridlines(true);
  
  // --- TITLE HEADER ---
  dashSheet.getRange("B2:H2").merge().setValue("🦅 CRM EXECUTIVE DASHBOARD")
    .setFontSize(18).setFontWeight("bold").setFontColor("#ffffff")
    .setBackground("#1e293b").setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.setRowHeight(2, 45);
  
  // --- KPI CARDS (Row 4 & Row 5) ---
  var kpis = [
    {col: "B", title: "TOTAL LEADS", formula: "=COUNTA('" + leadsSheetName + "'!A2:A)", color: "#f8fafc", titleColor: "#64748b", valColor: "#0f172a"},
    {col: "C", title: "CONVERTED", formula: "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Converted*\")", color: "#ecfdf5", titleColor: "#047857", valColor: "#065f46"},
    {col: "D", title: "FOLLOW-UP", formula: "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Follow-up*\")", color: "#eff6ff", titleColor: "#1d4ed8", valColor: "#1e40af"},
    {col: "E", title: "NOT INTERESTED", formula: "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Not intrested*\")", color: "#fef2f2", titleColor: "#b91c1c", valColor: "#991b1b"},
    {col: "F", title: "LINK SENT", formula: "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Link Sent*\")", color: "#faf5ff", titleColor: "#6b21a8", valColor: "#581c87"},
    {col: "G", title: "UNANSWERED", formula: "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Unanswered*\")", color: "#fff7ed", titleColor: "#c2410c", valColor: "#9a3412"},
    {col: "H", title: "CONV. RATE", formula: "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Converted*\")/COUNTA('" + leadsSheetName + "'!A2:A)", color: "#f0fdf4", titleColor: "#15803d", valColor: "#166534", isPct: true}
  ];
  
  dashSheet.setRowHeight(4, 22);
  dashSheet.setRowHeight(5, 32);
  
  kpis.forEach(function(k) {
    var titleCell = dashSheet.getRange(k.col + "4");
    var valCell = dashSheet.getRange(k.col + "5");
    
    titleCell.setValue(k.title).setFontSize(9).setFontWeight("bold").setFontColor(k.titleColor)
      .setBackground(k.color).setHorizontalAlignment("center").setVerticalAlignment("middle");
    
    valCell.setFormula(k.formula).setFontSize(16).setFontWeight("bold").setFontColor(k.valColor)
      .setBackground(k.color).setHorizontalAlignment("center").setVerticalAlignment("middle");
      
    if (k.isPct) {
      valCell.setNumberFormat("0.0%");
    }
  });
  
  // --- SECTION 1: STATUS BREAKDOWN & AGENT PERFORMANCE ---
  dashSheet.getRange("B7:D7").merge().setValue("📊 Overall Status Breakdown")
    .setFontSize(11).setFontWeight("bold").setFontColor("#ffffff").setBackground("#334155");
    
  dashSheet.getRange("B8:D8").setValues([["Status", "Lead Count", "Share %"]])
    .setFontWeight("bold").setBackground("#f1f5f9").setFontColor("#334155");
    
  var statusRows = [
    ["Follow-up", "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Follow-up*\")", "=C9/$B$5"],
    ["Not Interested", "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Not intrested*\")", "=C10/$B$5"],
    ["Link Sent", "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Link Sent*\")", "=C11/$B$5"],
    ["Unanswered", "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Unanswered*\")", "=C12/$B$5"],
    ["Converted", "=COUNTIF('" + leadsSheetName + "'!F:F, \"*Converted*\")", "=C13/$B$5"]
  ];
  
  for (var i = 0; i < statusRows.length; i++) {
    var r = 9 + i;
    dashSheet.getRange("B" + r).setValue(statusRows[i][0]);
    dashSheet.getRange("C" + r).setFormula(statusRows[i][1]);
    dashSheet.getRange("D" + r).setFormula(statusRows[i][2]).setNumberFormat("0.0%");
  }
  
  dashSheet.getRange("B14").setValue("Total Tracked").setFontWeight("bold");
  dashSheet.getRange("C14").setFormula("=SUM(C9:C13)").setFontWeight("bold");
  dashSheet.getRange("D14").setFormula("=SUM(D9:D13)").setNumberFormat("0.0%").setFontWeight("bold");
  dashSheet.getRange("B14:D14").setBackground("#f8fafc");

  // Agent Performance Table
  dashSheet.getRange("F7:J7").merge().setValue("👤 Sales Agent Performance")
    .setFontSize(11).setFontWeight("bold").setFontColor("#ffffff").setBackground("#334155");
    
  dashSheet.getRange("F8:J8").setValues([["Agent", "Total Leads", "Converted", "Not Interested", "Conv. Rate %"]])
    .setFontWeight("bold").setBackground("#f1f5f9").setFontColor("#334155");
    
  var agents = ["Nahan", "Fateen", "Mariyam"];
  for (var a = 0; a < agents.length; a++) {
    var rowIdx = 9 + a;
    var agent = agents[a];
    dashSheet.getRange("F" + rowIdx).setValue(agent);
    dashSheet.getRange("G" + rowIdx).setFormula("=COUNTIF('" + leadsSheetName + "'!E:E, \"" + agent + "\")");
    dashSheet.getRange("H" + rowIdx).setFormula("=COUNTIFS('" + leadsSheetName + "'!E:E, \"" + agent + "\", '" + leadsSheetName + "'!F:F, \"*Converted*\")");
    dashSheet.getRange("I" + rowIdx).setFormula("=COUNTIFS('" + leadsSheetName + "'!E:E, \"" + agent + "\", '" + leadsSheetName + "'!F:F, \"*Not intrested*\")");
    dashSheet.getRange("J" + rowIdx).setFormula("=IF(G" + rowIdx + ">0, H" + rowIdx + "/G" + rowIdx + ", 0)").setNumberFormat("0.0%");
  }
  
  // --- SECTION 2: DAILY PERFORMANCE TIMELINE ---
  dashSheet.getRange("B16:F16").merge().setValue("📅 Daily Performance Timeline (Date Breakdown)")
    .setFontSize(11).setFontWeight("bold").setFontColor("#ffffff").setBackground("#1e293b");
    
  var dailyHeader = [["Date", "Total Leads", "Converted", "Not Interested", "Follow-up"]];
  dashSheet.getRange("B17:F17").setValues(dailyHeader).setFontWeight("bold").setBackground("#e2e8f0");
  
  var dates = [
    "16/07/2026", "17/07/26", "18/07/26", "19/07/26", "20/07/26", 
    "21/07/26", "22/07/26", "23/07/26", "24/07/26", "1/8/2026", 
    "2/8/2026", "3/8/2026", "4/8/2026", "5/8/2026", "6/8/2026"
  ];
  
  for (var d = 0; d < dates.length; d++) {
    var currRow = 18 + d;
    var dVal = dates[d];
    dashSheet.getRange("B" + currRow).setValue(dVal);
    dashSheet.getRange("C" + currRow).setFormula("=COUNTIF('" + leadsSheetName + "'!B:B, \"" + dVal + "\")");
    dashSheet.getRange("D" + currRow).setFormula("=COUNTIFS('" + leadsSheetName + "'!B:B, \"" + dVal + "\", '" + leadsSheetName + "'!F:F, \"*Converted*\")");
    dashSheet.getRange("E" + currRow).setFormula("=COUNTIFS('" + leadsSheetName + "'!B:B, \"" + dVal + "\", '" + leadsSheetName + "'!F:F, \"*Not intrested*\")");
    dashSheet.getRange("F" + currRow).setFormula("=COUNTIFS('" + leadsSheetName + "'!B:B, \"" + dVal + "\", '" + leadsSheetName + "'!F:F, \"*Follow-up*\")");
  }
  
  // Adjust column widths
  dashSheet.setColumnWidth(1, 25);
  dashSheet.setColumnWidth(2, 140);
  dashSheet.setColumnWidth(3, 130);
  dashSheet.setColumnWidth(4, 130);
  dashSheet.setColumnWidth(5, 140);
  dashSheet.setColumnWidth(6, 140);
  dashSheet.setColumnWidth(7, 130);
  dashSheet.setColumnWidth(8, 130);
  dashSheet.setColumnWidth(9, 130);
  dashSheet.setColumnWidth(10, 130);
  
  SpreadsheetApp.getUi().alert("✅ CRM Dashboard tab successfully created!");
}
