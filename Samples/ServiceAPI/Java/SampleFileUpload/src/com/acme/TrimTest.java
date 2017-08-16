
package com.acme;
import java.util.ArrayList;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.auth.AuthenticationException;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import com.acme.dto.Record;
import com.acme.dto.RecordTypeRef;
import com.acme.dto.RecordsResponse;
import com.acme.dto.TrimStringProperty;
import com.acme.dto.UploadFileResponse;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.google.gson.stream.MalformedJsonException;

import java.io.File;
import java.io.IOException;
import net.servicestack.client.JsonServiceClient;
import net.servicestack.client.Utils;
import net.servicestack.client.WebServiceException;

public class TrimTest {

	private static UsernamePasswordCredentials creds = new UsernamePasswordCredentials("itu_tadmin", "XXXXXXXX");	
	private static String baseUrl = "http://localhost/ServiceAPI/";
	
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

	private static RuntimeException createException(int code, HttpResponse response)  {

		HttpEntity responseEntity = response.getEntity();
		String responseString;

		WebServiceException webEx = null;

		try {
			responseString = EntityUtils.toString(responseEntity, "UTF-8");

			webEx = new WebServiceException(code, response.getStatusLine().getReasonPhrase(), responseString);

			Gson gson = new Gson();

			JsonElement element = gson.fromJson(responseString, JsonElement.class);
			if(element != null) {
				JsonObject jsonObj = element.getAsJsonObject();

				for (Map.Entry<String,JsonElement> jsonElementEntry : jsonObj.entrySet()) {
					if(jsonElementEntry.getKey().toLowerCase().equals("responsestatus")) {
						webEx.setResponseStatus(Utils.createResponseStatus(jsonObj.get(jsonElementEntry.getKey())));
						break;
					}
				}

			}
			return webEx;
		} catch ( JsonSyntaxException | ParseException | IOException e) {
			if (webEx != null)
				return webEx;
			return new RuntimeException(e);
		}

	}
	
	
	private static String uploadFile(String filePath, JsonServiceClient sapiClient) throws ClientProtocolException, IOException, AuthenticationException {

		String uploadUrl = baseUrl + "UploadFile"; // e.g. full URL http://myserver/ServiceAPI/Uploadfile
		
		HttpClient client = HttpClientBuilder.create().build(); 
		
		
		HttpPost post = new HttpPost(uploadUrl);		

		post.addHeader(new BasicScheme().authenticate(creds, post, null));
		
		post.setHeader("Accept", "application/json");
		
		File file = new File(filePath);		

		
		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
		builder.addBinaryBody("Files", file, ContentType.DEFAULT_BINARY, file.getName());
		
		HttpEntity entity = builder.build();
		post.setEntity(entity);

		HttpResponse response = client.execute(post);
		
		int code = response.getStatusLine().getStatusCode();
		
		if (code != 200) {
			
            throw createException(code, response);
		}
		
		HttpEntity responseEntity = response.getEntity();
		String responseString = EntityUtils.toString(responseEntity, "UTF-8");

		UploadFileResponse uploadedFile = (UploadFileResponse) sapiClient.fromJson(responseString, UploadFileResponse.class);		


		return uploadedFile.FilePath;


	}
	
	public static void main(String[] args) throws AuthenticationException, ClientProtocolException, IOException {

		JsonServiceClient sapiClient = new JsonServiceClient(baseUrl);

		sapiClient.setCredentials(creds.getUserName(), creds.getPassword());
		sapiClient.setAlwaysSendBasicAuthHeaders(true);	


		Record request = new Record();

		RecordTypeRef recordType = new RecordTypeRef();
		recordType.setUri((long) 2);
		request.setRecordType(recordType);

		try {
			String filePath = uploadFile("c:/junk/testxps.DOC", sapiClient);

			TrimStringProperty filePathProperty = new TrimStringProperty();
			filePathProperty.setValue(filePath);

			request.setFilePath(filePathProperty);

			request.Properties = makePropertyList("RecordTitle");

			RecordsResponse response = sapiClient.post(request);

			for (dto.Record record : response.Results) {
				System.out.println(record.getTitle().Value);
			}

		}
		catch(WebServiceException ex) {
			System.out.println(ex.getStatusCode());
			System.out.println(ex.getErrorMessage());
		}



	}

}
