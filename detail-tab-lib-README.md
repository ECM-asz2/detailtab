# Library for communication between dbs | case manager (contract) and the custom detail tabs

## Install
    $ yarn install
    $ yarn run build

    
## Use
	import { DetailTabJSLib } from "cm-detail-tab-lib";    
	const detailTabConnector = new DetailTabJSLib();
	
### Methods of DetailTabJSLib

Method name | Method description
--- | --- 
registerForDataChange( function ) | Register your detail tab for data change events. If you receive a message due to a data change event, the callback function will get called. The case data object including only the changed properties will be the first and only parameter given to functionHandler.
registerForPreSave( function ) | Register your detail tab for a pre save action. If the save button is clicked all pre save actions will be called before the case will be saved. Each pre save action can abort the saving process by returning false. Otherwise the callback function has to return true. The callback function will be called right before saving the case. The whole case data object will be the first and only parameter given to functionHandler.
registerForPostSave | ??
callForData() | Ask for getting the whole case data object. This method will trigger the functionHandler registered for data change. 
setVisibilityOfTab( boolean ) | true: The detail tab will be displayed; false: the detail tab will be hidden.
setTitle( string ) | Set the displayed text for your detail tab. The text will be shown in the navigation menu on the left side and as the title of your detail tab area. You could use this function to set a specific text depending on the user's selected language.
updateData( caseData ) | Change one or multiple case data properties. 

	
### Case data object
The data object for a case file looks like this: 

	caseData = {
		masterData: {
			description: string,
			internalNumber: string,
			externalNumber: string,
			type: string,
			status: string,
			responsible: string,
			orgaUnit: string,
			partnerIds: Array<string>,
			roles: Array<string>,
			contactPersons: Array<string>
		},
		advMasterData: {
			additionalSingleValueData: {
				<db-position as int>: string
			},
			additionalMultiValueData: {
				<db-position as int>: Array<string>
			}
		},
		period: {
			term: date as iso string,
			reminder: date as iso string
		}
	}
	
The data object for a contract looks like this: 

	caseData = {
		masterData: {
			description: string,
			internalNumber: string,
			externalNumber: string,
			type: string,
			status: string,
			responsible: string,
			orgaUnit: string,
			blanketAgreement: string,
			storageLocation: string,
			frame: boolean,
			contractValue: double,
			partnerIds: Array<string>,
			roles: Array<string>,
			contactPersons: Array<string>
		},
		advMasterData: {
			additionalSingleValueData: {
				<db-position as int>: string
			},
			additionalMultiValueData: {
				<db-position as int>: Array<string>
			}
		},
		period: {
			start: date as iso string,
			signing: date as iso string,
			end: date as iso string,
			durationType: Undetermined|End_date|Duration,
			durationCount: int,
			durationUnit: Workday|Day|Week|Month|Year
		}
	}
	