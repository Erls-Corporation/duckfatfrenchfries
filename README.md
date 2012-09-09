duckfatfrenchfries
==================

Browser Support: 
Due to the short nature and audience for this project, a modern browser is the expectation, preferably a webkit browser.  I suggest Google Chrome.

Mobile: 
There is nothing here that should not perform very well in a mobile context, primarily iOS Safari or Chrome and Chrome on Android.

Deployment: 
There is NO server component, everything runs in the web client.  You can clone and then open the index.html file, of if you would rather host if somewhere, upload the whole directory and point your web server configuration to server the /web directory.

WebDB: 
DF3 uses the webDb standard (a relational data store, basically sqlite) for persisting data, a modernish web browser will allow you to save your data to the local database. If you don't have WebDB capability, DF3 will warn you that your content will be viewable, but not persisted and ask you to upgrade.

File API: 
DF3 uses the File API for getting the csv file contents, this file is not uploaded anywhere, but once again, a modernish browser will be necessary.  If you don't have File API capability you will only see the textarea input.

CSV format:  
A CSV format where the first row is intended to be the table headers is expected.  The columns should follow this format: Date, Sev 2, Sev 3, Sev 4, To Verify, Total Open Defects, Total Defects

Documents: 
DF3 stores a document record for each input (file or pasted into the textarea), this is saved with the a timestamp as its "name", it also saves the initial input csv, the total average of open defects and the column headers

Days: 
The rows of the csv file are saved as "days" in the database, these records include all of the row data after the column headers as well as the document timestamp that they are attached to and an added on datetime.

Goals and Conventions: 
Due to the nature of this project I chose not to use an MVVM framework.  Primarily this is a factor of wanting compact and grokkable methods rather than having a framework obscure the work.  The same can be said of the choice for not choosing to use a server component.  The requirements of the project do not dictate multiple users for the data nor providing a security model for said data.  A big upside to a client-based solution is that latency and security concerns are minimized.

Testing, TDD and BDD:
There is light testing on pieces I felt needed coverage, this is a "low hanging fruit" attempt to test.  Timeframe and scope made comprehensive coverage unlikely.