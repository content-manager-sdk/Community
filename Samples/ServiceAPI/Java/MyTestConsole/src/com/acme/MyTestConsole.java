package com.acme;

import java.util.ArrayList;

import com.acme.dto.Records;
import com.acme.dto.RecordsResponse;

import net.servicestack.client.JsonServiceClient;
import net.servicestack.client.WebServiceException;


public class MyTestConsole {
	  public static void main ( String [] arguments )
	    {
	        System.out.println("Hello, world");
	        
	        JsonServiceClient client = new JsonServiceClient("http://192.168.0.19/ServiceAPI91/");
	        client.setCredentials("itu_tenduser", "password");
	        
	        Records request = new Records();
	        request.q = "number:rec_0";
	        
	        ArrayList<String> properties = new ArrayList<String>();
	        properties.add("RecordTitle");
	        properties.add("RecordNumber");
	        
	        request.Properties = properties;
	        
	        
	        try {
	        	RecordsResponse response = client.get(request);
	       
	        	System.out.println(response.Results.get(0).Number.getValue());
	       
	        } 
	        catch (WebServiceException ex) {
	        	System.out.println(ex.getErrorMessage());
	        }

	    }
}
