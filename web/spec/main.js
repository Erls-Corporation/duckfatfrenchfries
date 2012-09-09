describe("Defects", function(){
	it("should set up and open a database if websql is supported", function(){
		spyOn(DF3, "initialize").andReturn('false');
		capabilities.webDb = true;
		expect(DF3.db.database.version).toEqual("1.0");
	});

	it("should create alert the user if websql is not supported", function(){
		spyOn(DF3, "initialize").andReturn('false');
		capabilities.webDb = false;
		spyOn(DF3.browser, "alertUser");
		expect(DF3.browser.alertUser).toHaveBeenCalledWith("capability_failure_webdb");
	});

	it("should identify a good csv input", function(){

	});

	it("should identify a misformated csv input", function(){

	});

	it("should identify a potential SQL injection attack in the csv input", function(){

	});

	it("should add a new document row with a timestamp", function(){

	});

	it("should add a new day row", function(){

	});

	it("should hide the file input if the File API is not supported", function(){
		spyOn(DF3, "initialize").andReturn('false');
		capabilities.fileApi = false;
		DF3.initialize();
		expect($('#upload_container').hasClass("hidden")).toBeTruthy();

	});


})