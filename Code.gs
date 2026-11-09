// ==========================================
// STORE OPERATIONS MAP - SERVER CODE (FINAL V3.2)
// Includes Automated Alerts & Firebase Webhook
// ==========================================

var SS_ID = "1HU9i8rlIQTMLQBOhuYFDz4FixOxgG7YZxba1NfSRfYI";

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Area Map View') 
    .setFaviconUrl('https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSS() {
  try { return SpreadsheetApp.openById(SS_ID); } catch(e) { return null; }
}

function saveReport(text) {
  try {
    var ss = getSS();
    if (!ss) throw new Error("Spreadsheet not found");
    var sheet = ss.getSheetByName("Reports");
    if (!sheet) { 
        sheet = ss.insertSheet("Reports");
        sheet.appendRow(["Timestamp", "Issue Description"]); 
        sheet.setFrozenRows(1); 
    }
    sheet.appendRow([new Date(), text]);
    return "Success";
  } catch (e) { return "Error: " + e.toString(); }
}

function getSheetData() {
  try {
    var ss = getSS();
    if (!ss) return JSON.stringify([{error: "Database Connection Error!"}]);
    
    var sheet = ss.getSheetByName("Polygon");
    if (!sheet) return JSON.stringify([{error: "Tab 'Polygon' is missing in Google Sheet"}]);

    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return JSON.stringify([]);
    
    var cleanData = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[2]) continue; 

      var coordList = [];
      for (var k = 7; k < row.length; k++) {
        var cellVal = String(row[k]).trim();
        if (cellVal && cellVal.includes(',')) coordList.push(cellVal);
      }

      var storeLat = null, storeLng = null;
      if (row[6]) {
        var parts = String(row[6]).replace(/[\[\]()'"\s]/g, '').split(',');
        if (parts.length >= 2) { 
            storeLat = parseFloat(parts[0]); 
            storeLng = parseFloat(parts[1]); 
        }
      }

      var sTime = row[4] instanceof Date ? row[4].toTimeString().substring(0,5) : String(row[4]);
      var eTime = row[5] instanceof Date ? row[5].toTimeString().substring(0,5) : String(row[5]);
      
      cleanData.push({
        cluster: String(row[0]).trim(), 
        name: String(row[2]).trim(), 
        status: String(row[3]).trim(), 
        startTime: sTime, 
        endTime: eTime, 
        storeLat: storeLat, 
        storeLng: storeLng, 
        coords: coordList
      });
    }
    return JSON.stringify(cleanData);
  } catch (err) { return JSON.stringify([{error: "Sheet Error: " + err.toString()}]); }
}

function getHeatMapData() {
  try {
    var ss = getSS();
    if (!ss) return JSON.stringify([{error: "Database Connection Error"}]);
    var sheet = ss.getSheetByName("Heat Map Dump");
    if (!sheet) return JSON.stringify([{error: "Tab 'Heat Map Dump' Missing"}]);

    var data = sheet.getDataRange().getValues();
    if(data.length < 2) return JSON.stringify([]);
    
    var cleanData = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if(!row[1] || !row[2]) continue; 

      var statusRaw = String(row[6] || "").trim(); 
      var statusLower = statusRaw.toLowerCase();
      
      var rawCoords = statusLower.includes("del") ? row[8] : row[7];
      if (!rawCoords || String(rawCoords).trim() === "") rawCoords = row[8] || row[7] || "";
      if (rawCoords) {
        var strCoords = String(rawCoords).replace(/[\[\]()'"\s]/g, ''); 
        var parts = strCoords.split(','); 
        
        if(parts.length >= 2) {
            var lat = parseFloat(parts[0]);
            var lng = parseFloat(parts[1]);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              var d = row[1]; 
              var dateStr = "";
              
              if (d instanceof Date) {
                  var y = d.getFullYear();
                  var m = ("0" + (d.getMonth() + 1)).slice(-2);
                  var day = ("0" + d.getDate()).slice(-2);
                  dateStr = y + "-" + m + "-" + day;
              } else {
                  dateStr = String(d || "").substring(0, 10);
              }
              
              cleanData.push({
                date: dateStr, 
                time: String(row[2] || "").trim(), 
                store: String(row[5] || "").trim(),    
                status: statusRaw, 
                riderName: String(row[3] || "").trim(), 
                riderId: String(row[9] || "").trim(),   
                customerName: String(row[10] || "").trim(), 
                lat: lat, 
                lng: lng
              });
            }
        }
      }
    }
    return JSON.stringify(cleanData);
  } catch (err) { return JSON.stringify([{error: "HeatMap Parse Error: " + err.toString()}]); }
}

function uploadCSVData(csvText) {
  try {
    var ss = getSS();
    if (!ss) return "Error: Database Connection Error";
    var sheet = ss.getSheetByName("Order Dump");
    if (!sheet) { sheet = ss.insertSheet("Order Dump"); }
    
    var data = Utilities.parseCsv(csvText);
    if (data.length === 0) return "Error: The CSV file is empty.";
    var cleanData = data.map(function(row) {
      var newRow = row.slice(0, 34); 
      while(newRow.length < 34) newRow.push(""); 
      return newRow;
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, cleanData.length, 34).setValues(cleanData);
    return "Success: " + cleanData.length + " rows successfully uploaded!";
  } catch (e) { return "Error: " + e.toString(); }
}

function updatePolygonData(fileText, isJSON) {
  try {
    var ss = getSS();
    if(!ss) return "Error: Database Connection Error";
    
    var sheet = ss.getSheetByName("JSON");
    if(!sheet) { sheet = ss.insertSheet("JSON"); }
    
    var dataToUpload = [];
    if (isJSON) {
        var jsonParsed = JSON.parse(fileText);
        if(!Array.isArray(jsonParsed) || jsonParsed.length === 0) {
            return "Error: JSON is empty or not formatted correctly.";
        }
        
        var headers = Object.keys(jsonParsed[0]);
        dataToUpload.push(headers);
        
        for(var i=0; i < jsonParsed.length; i++) {
           var row = [];
           for(var j=0; j < headers.length; j++) {
               row.push(jsonParsed[i][headers[j]] || "");
           }
           dataToUpload.push(row);
        }
    } else {
        dataToUpload = Utilities.parseCsv(fileText);
        if(dataToUpload.length === 0) return "Error: The CSV file is empty.";
    }

    sheet.clearContents();
    sheet.getRange(1, 1, dataToUpload.length, dataToUpload[0].length).setValues(dataToUpload);
    return "Success: JSON Tab updated with " + dataToUpload.length + " rows!";
  } catch (e) { return "Error: " + e.toString(); }
}

function addStoreData(data) {
  try {
    var ss = getSS();
    if (!ss) return "Error: Database Connection Error";

    var storesSheet = ss.getSheetByName("Stores");
    if (!storesSheet) {
      storesSheet = ss.insertSheet("Stores");
      storesSheet.appendRow(["Cluster", "Store Name", "Store ID", "Store Coordinates"]);
      storesSheet.setFrozenRows(1);
    }
    storesSheet.appendRow([data.cluster, data.storeName, data.storeId, data.shopCoords]);

    var polySheet = ss.getSheetByName("Polygon");
    if (!polySheet) {
      polySheet = ss.insertSheet("Polygon");
      polySheet.appendRow(["Cluster", "Col B", "Store Name", "Status", "Start Timing", "End Timing", "StoreLat/Lng", "Point1", "Point2"]);
      polySheet.setFrozenRows(1);
    }
    
    var lastRow = polySheet.getLastRow();
    var targetRow = lastRow + 1;
    if (lastRow > 0) {
        var dValues = polySheet.getRange(1, 4, lastRow, 1).getValues();
        for (var i = 0; i < dValues.length; i++) {
            if (String(dValues[i][0]).trim() === "") {
                targetRow = i + 1;
                break;
            }
        }
    }

    var polyArray = data.polyCoords.split('|').map(function(s){ return s.trim(); });
    var finalDataRow = [data.cluster, "", data.storeName, data.status, data.startTime, data.endTime, data.shopCoords];
    finalDataRow = finalDataRow.concat(polyArray); 

    polySheet.getRange(targetRow, 1, 1, finalDataRow.length).setValues([finalDataRow]);
    return "Success: Store data & Polygon added to sheets.";
  } catch(e) { return "Error: " + e.toString(); }
}

function deleteStoreData(storeName) {
    try {
        var ss = getSS();
        if(!ss) return "Error: Database Connection";
        var nameLower = storeName.trim().toLowerCase();
        
        var storesSheet = ss.getSheetByName("Stores");
        if(storesSheet) {
            var sData = storesSheet.getDataRange().getValues();
            for(var i = sData.length - 1; i >= 1; i--) { 
                if(String(sData[i][1]).trim().toLowerCase() === nameLower) { 
                    storesSheet.deleteRow(i + 1);
                }
            }
        }
        
        var polySheet = ss.getSheetByName("Polygon");
        if(polySheet) {
            var pData = polySheet.getDataRange().getValues();
            for(var j = pData.length - 1; j >= 1; j--) {
                if(String(pData[j][2]).trim().toLowerCase() === nameLower) { 
                    polySheet.deleteRow(j + 1);
                }
            }
        }
        return "Success: Store has been successfully deleted from records.";
    } catch(e) { return "Error: " + e.toString(); }
}

function clearCSVData() {
  try {
    var ss = getSS();
    if (!ss) return "Error: Database Connection Error";
    var sheet = ss.getSheetByName("Order Dump");
    if (!sheet) return "Error: Tab 'Order Dump' Missing";
    sheet.clearContents();
    return "Success: All data (including headers) cleared completely!";
  } catch (e) { return "Error: " + e.toString(); }
}

// ==========================================
// NEW: FIREBASE WEBHOOK (Auto-Sync)
// ==========================================
function onEdit(e) {
  if (!e) return;
  var sheetName = e.source.getActiveSheet().getName();
  
  if (sheetName === "Order Dump" || sheetName === "Heat Map Dump" || sheetName === "Stores" || sheetName === "Polygon") {
    var firebaseUrl = "https://YOUR-PROJECT-ID.firebaseio.com/map_updates.json";
    
    // SAFE FALLBACK: Will simply exit without error if you haven't added your Firebase URL yet
    if(firebaseUrl.indexOf("YOUR-PROJECT") !== -1) return; 
    
    var payload = JSON.stringify({ lastUpdate: new Date().getTime() });
    var options = { "method": "put", "contentType": "application/json", "payload": payload, "muteHttpExceptions": true };
    UrlFetchApp.fetch(firebaseUrl, options);
  }
}

// ==========================================
// NEW: AUTOMATED ANOMALY ALERTING
// (Set this on a 1-Hour Time-Driven Trigger in Apps Script)
// ==========================================
function checkAndAlertAnomalies() {
  var ss = getSS();
  if (!ss) return;
  var sheet = ss.getSheetByName("Heat Map Dump");
  if (!sheet) return;
  
  var data = sheet.getDataRange().getValues();
  var failedOrders = [];
  
  for(var i = 1; i < data.length; i++) {
    var status = String(data[i][6]).toLowerCase();
    if(!status.includes("del")) {
      var rawCoords = data[i][8] || data[i][7];
      if (rawCoords) {
        var coords = String(rawCoords).replace(/[\[\]()'"\s]/g, '').split(',');
        if(coords.length >= 2) {
          failedOrders.push({ lat: parseFloat(coords[0]), lng: parseFloat(coords[1]), store: data[i][5] });
        }
      }
    }
  }
  
  var alertClusters = [];
  for(var i = 0; i < failedOrders.length; i++) {
     var nearbyCount = 0;
     for(var j = 0; j < failedOrders.length; j++) {
        if(i === j) continue;
        if(getHaversineDistance(failedOrders[i].lat, failedOrders[i].lng, failedOrders[j].lat, failedOrders[j].lng) <= 150) {
           nearbyCount++;
        }
     }
     if(nearbyCount >= 4 && !alertClusters.includes(failedOrders[i].store)) { 
         alertClusters.push(failedOrders[i].store);
     }
  }
  
  if(alertClusters.length > 0) {
     var uniqueStores = [...new Set(alertClusters)];
     MailApp.sendEmail({
       to: Session.getActiveUser().getEmail(),
       subject: "URGENT: Delivery Anomaly Detected",
       body: "System Alert: We have detected clusters of 5 or more failed/attempted orders within a 150-meter radius.\n\nAffected Store Areas: " + uniqueStores.join(", ") + "\n\nPlease check the Operations Map immediately."
     });
  }
}

function getHaversineDistance(lat1, lon1, lat2, lon2) {
  var R = 6371000;
  var dLat = (lat2 - lat1) * (Math.PI / 180);
  var dLon = (lon2 - lon1) * (Math.PI / 180); 
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}
