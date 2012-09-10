// lets add an average method to the array
Array.prototype.avg = function(){
	var len = this.length;
	var total = 0;
	for (var i = 0; i < len; i++) {
		if (!isNaN(this[i])){
			total += parseInt(this[i]);
		}
	}
	return total/len;
}


// DF3 is going to be our application namespace, so set that up
var DF3 = {};
var capabilities = {};
	
	//setup the csv handler
	DF3.csv = {};
	//set up the webdb
	DF3.db = {};
	//setup the browser interaction
	DF3.browser = {};

	// Figure out what the browser will let us do
	DF3.browser.determineCapabilities = function(){
		capabilities.webDb = !!window.openDatabase;
		capabilities.fileApi = !!window.File;
	}

	//sets up the inputs, the file input and the textarea
	//TODO: this is misnamed now, refactor
	DF3.browser.setupFileUploader = function(){
		$("#pastebox_save").live('click', function(){
			console.log("New Data from the Pastebox");
			DF3.csv.parseCSV($("#pastebox").val());
		});

		if (capabilities.fileApi){
			//Style up the uploader button
			$('#upload').filestyle({
				buttonText: 'Upload file',
				classButton: 'btn-inverse',
				icon: true,
				classIcon: 'icon-arrow-up icon-white',
				textField: false
			});

			$("#upload").live('change', function(e){
				console.log("New Data from the file api");
				DF3.csv.parseFile(e);

			});

		}else{
			$("#upload_container").addClass("hidden");
			$("#or_container").addClass("hidden");
		}
	}

	// tell the user something
	DF3.browser.alertUser = function(alertType){
		$("#"+alertType).removeClass("hidden");
	}

	DF3.browser.displayData = function(col_names, days, document_average_total, csv){
		//lets cache the table references since we're going to hit them a bunch
		console.log("Displaying data with columns "+JSON.stringify(column_names));

		var table_body = $("#display_table tbody");	
		var last_tbody_row = $("#display_table tbody:last");
		
		var column_names = JSON.parse(col_names);
		var columns = "<tr><th>"+column_names[0]+"</th>"+
			"<th>"+column_names[1]+"</th>"+
			"<th>"+column_names[2]+"</th>"+
			"<th>"+column_names[3]+"</th>"+
			"<th>"+column_names[4]+"</th>"+
			"<th>"+column_names[5]+"</th>"+
			"<th>"+column_names[6]+"</th></tr>";

		//ok first the column names
		$("#display_table thead").html(columns);
		
		var days_len = days.length;
		table_body.html("");
		for(var i = 0; i<days_len; i++){
			var day = days[i];
			last_tbody_row.append("<tr>"+
				"<td>"+day.list_date+"</td>"+
				"<td>"+day.severity_2+"</td>"+
				"<td>"+day.severity_3+"</td>"+
				"<td>"+day.severity_4+"</td>"+
				"<td>"+day.to_verify+"</td>"+
				"<td>"+day.total_open_defects+"</td>"+
				"<td>"+day.total_defects+"</td>"+
				"</tr>"
			);
		}

		$("#total_open_avg p").html(Math.round(document_average_total));
		$("#total_open_avg").removeClass("hidden");
	}

	//handle the csv input from the file "uploader"
	DF3.csv.parseFile = function(e){
		console.log("Parsing file contents");
		e = e || window.event;
        e.preventDefault();
        e = e.originalEvent || e;

        //since we're not doing multiple files I'm just going to grab the 0 index
        // if you want to have multiples, loop files.
        var file = e.target.files[0];

		var reader = new FileReader();
      	reader.onload = function(e) { 
	      DF3.csv.parseCSV(e.target.result);      
      	}
      	reader.readAsText(file);
        
	}

	//takes the raw csv content and returns a parsed array
	DF3.csv.parseCSV = function(csv){
		var contentArray = CSVToArray(csv);
		DF3.csv.prepareSave(contentArray, csv);
	}


	//takes the array created from parsing the csv and prepares it to be saved and presented.
	DF3.csv.prepareSave = function(contentArray, csv){
		var len = contentArray.length;
		var total_defect_array = [];
		var day_array = [];
		for (var i=0; i<len; i++){
			if (i > 0){
				var row = contentArray[i];
				if (row[0]){
					total_defect_array[i] = row[5];
					day_array.push({'list_date' : row[0],
						'severity_2' : row[1],
						'severity_3' : row[2],
						'severity_4' : row[3],
						'to_verify' : row[4],
						'total_open_defects' : row[5],
						'total_defects' : row[6]
					});
				}

			}else{
				var column_names = JSON.stringify(contentArray[i]);
			}
		}
		var document_average_total = total_defect_array.avg();
		var timestamp = new Date().getTime();

		//save the data
		//document
		DF3.db.addDocument(timestamp, csv, document_average_total, column_names);
		console.log("Adding a document record for "+timestamp+" with "+JSON.stringify(column_names));

		//day
		var day_len = day_array.length;
		for (var j=0; j<day_len; j++){
			DF3.db.addDay(day_array[j], timestamp);
			console.log("Adding a day record for "+JSON.stringify(day_array[j]));
		}

		//display the data
		DF3.browser.displayData(column_names, day_array, document_average_total, csv);
	}


	//open the defects database
	DF3.db.open = function(){
		 if (capabilities.webDb){
		 	// add the db with the typical max (5 mb)
		 	DF3.db.database = openDatabase("Defects", "1.0", "Defects", 5 * 1024 * 1024);
		 }else{
		 	DF3.browser.alertUser("capability_failure_webdb");
		 }
	}

	// Document Schema
	// ID int
	// document_id int
	// document_average_total real
	// initial_document text
	// column_names text
	// added_on datetime

	DF3.db.createDocumentsTable = function(){
		DF3.db.database.transaction(function(tx) {
    		tx.executeSql("CREATE TABLE IF NOT EXISTS documents(ID INTEGER PRIMARY KEY ASC, document_id TEXT,"+
    			" document_average_total REAL, initial_document TEXT, added_on DATETIME)", []);
  		});
	}

	//add the document to the db, the schema is above with the create method
	DF3.db.addDocument = function(timestamp, initial_document, total_average, column_names){
		DF3.db.database.transaction(function(tx){
    		var addedOn = new Date();
    		tx.executeSql("INSERT INTO documents(document_id, document_average_total, initial_document, added_on) VALUES (?,?,?)",
        	[timestamp, total_average, initial_document, column_names, addedOn],
        	DF3.db.onSuccess,
        	DF3.db.onError);
   		});
	}

	// Day Schema
	// ID int
	// document_id int
	// severity_2 int
	// severity_3 int
	// severity_4 int
	// to_verify int
	// total_open_defects int
	// total_defects int
	// added_on datetime

	DF3.db.createDayTable = function(){
		DF3.db.database.transaction(function(tx) {
    		tx.executeSql("CREATE TABLE IF NOT EXISTS days(ID INTEGER PRIMARY KEY ASC, document_id INTEGER,"+
    			" list_date TEXT, severity_2 INT, severity_3 INT, severity_4 INT, to_verify INT,"+
    			" total_open_defects INT, total_defects INT,  added_on DATETIME)", []);
  		});
	}

	//add the "day" to the db, the schema is above with the create method
	DF3.db.addDay = function(day, timestamp){
		DF3.db.database.transaction(function(tx){
    		var addedOn = new Date();
    		tx.executeSql("INSERT INTO days(document_id, list_date,"+
    			" severity_2, severity_3, severity_4, to_verify, total_open_defects, total_defects, added_on"+
    			") VALUES (?,?,?,?,?,?,?,?,?)",
        	[timestamp, day.list_date, day.severity_2, day.severity_3, day.severity_4, day.to_verify, day.total_open_defects, day.total_defects, addedOn],
        	DF3.db.onSuccess,
        	DF3.db.onError);
   		});
	}

	// call this when good things happen on the db, basically just console.logs right now
	DF3.db.onSuccess = function(tx, r){
		console.log("Data saved: "+JSON.stringify(r));
	}
	// call this when bad things happen on the db, log out and do an alert
	DF3.db.onFailure = function(tx, e){
		console.log("Data Failed to Save: "+JSON.stringify(e));
		 DF3.browser.alertUser("db_failure");
	}

	initialize = function(){
		DF3.browser.determineCapabilities();
		DF3.browser.setupFileUploader();
		DF3.db.open();
	}()
