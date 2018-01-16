package com.acme;

import java.net.HttpURLConnection;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import com.acme.dto.Records;
import com.acme.dto.RecordsResponse;
import com.acme.dto.StringDisplayType;
import com.acme.dto.TrimStringProperty;
import com.acme.dto.FieldDefinition;
import com.acme.dto.ITrimProperty;
import com.acme.dto.Location;
import com.acme.dto.LocationFind;
import com.acme.dto.LocationsResponse;
import com.acme.dto.PropertyType;
import com.acme.dto.Record;
import com.acme.dto.RecordTypeRef;

import net.servicestack.client.ConnectionFilter;
import net.servicestack.client.JsonServiceClient;
import net.servicestack.client.WebServiceException;

public class MyTestConsole {

	private static JsonServiceClient client;

	private static ArrayList<String> makePropertyList(String... propertyNames) {
		ArrayList<String> properties = new ArrayList<String>();
		
		if (propertyNames.length > 0) {
			for (String propertyName : propertyNames) {
				properties.add(propertyName);
			}
		} else {
			properties.add("RecordTitle");
			properties.add("RecordNumber");
		}
		return properties;
	}

	@SuppressWarnings("unused")
	private static void getMyName() {
		// Fetch my Location object
		

		LocationFind request = new LocationFind();
		request.Id = "me";
		

		request.Properties = makePropertyList("SortName");

		try {
			LocationsResponse response = client.get(request);

			for (Location loc : response.Results) {
				System.out.println(loc.SortName.Value);
			}

		} catch (WebServiceException ex) {
			System.out.println(ex.getErrorMessage());
		}
		

	}
	
	@SuppressWarnings("unused")
	private static void recordSearch() {
		// Fetch a record
		Records request = new Records();
		request.q = "number:rec_0";

		request.Properties = makePropertyList();

		try {
			RecordsResponse response = client.get(request);

			System.out.println(response.Results.get(0).Number.getValue());

		} catch (WebServiceException ex) {
			System.out.println(ex.getErrorMessage());
		}
	}
	
	@SuppressWarnings("unused")
	private static void recordSearchWithFields()  {
		// Fetch a record
		Records request = new Records();
		request.q = "number:rec_222";
		
		// tell the search request to return both string and actual values for the fields and properties
		request.setPropertyValue(PropertyType.Both);
		request.setStringDisplayType(StringDisplayType.WebService);		

		request.Properties = makePropertyList("RoadSurface", "DateOfIssue", "PoliceOfficer");

		try {
			RecordsResponse response = client.get(request);

			Record rec = response.Results.get(0);
			
			ITrimProperty roadSurface = rec.Fields.get("RoadSurface");
			ITrimProperty dateOfIssue = rec.Fields.get("DateOfIssue");
			
			SimpleDateFormat parser = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss zzz");
	        Date date = parser.parse(dateOfIssue.getStringValue());
			
			ITrimProperty policeOfficer = rec.Fields.get("PoliceOfficer");
						
			System.out.println(roadSurface.getStringValue());
			System.out.println(date);
			System.out.println(dateOfIssue.getStringValue());
			System.out.println(policeOfficer.getStringValue());

		} catch (WebServiceException ex) {
			System.out.println(ex.getErrorMessage());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unused")
	private static void recordCreate() {

		Record record = new Record();

		RecordTypeRef recordType = new RecordTypeRef();
		recordType.setUri((long) 2); // I have a Record Type with the Uri 2
		record.setRecordType(recordType);

		TrimStringProperty titleProp = new TrimStringProperty();
		titleProp.setValue("test title 68");
		record.setTitle(titleProp);

		// this tells the request that we want to return the title and number of the 
		// newly created record in the POST response
		record.Properties = makePropertyList();

		try {
			RecordsResponse response = client.post(record);

			System.out.println(response.Results.get(0).getTitle().getValue());

		} catch (WebServiceException ex) {
			System.out.println(ex.getErrorMessage());
		}
	}

	@SuppressWarnings("unused")
	private static void recordCreateWithAdditionalField() {

		Record record = new Record();

		RecordTypeRef recordType = new RecordTypeRef();
		recordType.setUri((long) 2); // I have a Record Type with the Uri 2
		record.setRecordType(recordType);

		TrimStringProperty titleProp = new TrimStringProperty();
		titleProp.setValue("test with additional field");
		record.setTitle(titleProp);

		// this tells the request that we want to return the title and number of the 
		// newly created record in the POST response
		record.Properties = makePropertyList();
		
		record.AdditionalFields = new HashMap<String, String>();
		record.AdditionalFields.put("Speed", "200");

		try {
			RecordsResponse response = client.post(record);

			System.out.println(response.Results.get(0).getTitle().getValue());

		} catch (WebServiceException ex) {
			System.out.println(ex.getErrorMessage());
		}
	}

	public static void main(String[] arguments) {
		System.out.println("Hello, world");

		client = new JsonServiceClient("http://localhost/ServiceAPI");
		client.setCredentials("YOUR_USERNAME", "YOUR_PASSWORD");
		
		
		// if the user specified in setCredentials has been given permission to impersonate via the hptrim.config
		// option 'trustedToImpersonate' then you may use the code below to impersonate any user.
/*		
		client.RequestFilter = new ConnectionFilter() {
            @Override
            public void exec(HttpURLConnection conn) {
                conn.addRequestProperty("userToImpersonate", "itu_tenduser");
            }
        };
*/		

		// this next line is important for basic authentication
		client.setAlwaysSendBasicAuthHeaders(true);

		recordSearchWithFields();
		
		// recordSearch();
		 //recordCreate();
		//recordCreateWithAdditionalField();

	}
}
