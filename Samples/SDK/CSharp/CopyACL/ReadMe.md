# Copy ACL
This script copies the ACL settings from 'Update Metadata' to 'Contribute Contents' for each Record in the saved search 'ACL Test'.

## Where to look
Points of interest:
 * We do not modify the ACL as a property (e.g. record.AccessControlList.SetAccessLocations() as the SDK does not handle modifying complex objects, instead we set the ACL in the variable 'acl' and then set 'record.AccessControlList = acl' when we are finished.
 * This script is written against the CM 10 SDK, change TRIM.SDK to HP.HPTRIM.SDK for earler CM versions.
