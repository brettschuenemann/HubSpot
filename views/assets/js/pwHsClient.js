
	var company = {
		domain : 'prosperworks.com'
	};

	var person = {
		email : 'michael@dundermifflin.com'
	};

	var zenCard;

	try {
		var pwSdkObj = PWSDK.init();
	} catch(err) {
		console.log(err);	
	}

	$(function() {
		
		if (pwSdkObj) {
			pwSdkObj.setAppUI({height: 300	});
			pwSdkObj.getContext().then(function(data) {
				var entityType = data.context.entity_type;

				if(entityType === 19) {
					company.domain = data.context.email_domain;
					fetchHubspotContactsByCompany(company);
				} else if(entityType === 3) {
					person.email = data.context.primary_email;
					fetchHubspotContactsForContact(person);
				}
			});
		}

		hubspotContactsList = new Vue({
			el: '#hubspotContactsList',
			data: {
			user: '',
			items: [],
			status: 'new',
			newTicketUrl: ''
			}
		})

		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function fetchHubspotContactsByCompany(company){
			$.ajax({
				type: 'GET',
				dataType: 'json',
				data: company,
				url: '/contactsbycompany',
				success: function(result) {
					console.log(result);
					hubspotContactsList.status = 'success';
					hubspotContactsList.items = [];
					prepareHubspotContactsList(result);
				},

				error: function(result) {
					console.log(result);
					hubspotContactsList.status = 'error';
				}
			});
		}
		
		function fetchHubspotContactsForContact(person){
			$.ajax({
				type: 'GET',
				dataType: 'json',
				data: person,
				url: '/contactsforcontact',
				success: function(result) {
					console.log(result);
					hubspotContactsList.status = 'success';
					hubspotContactsList.items = [];
					prepareHubspotContactsList(result);
				},

				error: function(result) {
					console.log(result);
					hubspotContactsList.status = 'error';
				}
			});
		}

		function prepareHubspotContactsList(hubspotResult) {
			$.each(hubspotResult, function(index){

				var contactName  = hubspotResult[index].properties.firstname.value + ' ' + hubspotResult[index].properties.lastname.value;
				var contactId = hubspotResult[index]['profile-token'];
				var lifecycleStage = hubspotResult[index].properties.lifecyclestage.value;
				var created = new Date();
				created.setTime(hubspotResult[index].properties.createdate.value);
				console.log(created);
				var created_formatted = 
					created.getMonth()+1 + '-' + 
					created.getDate() + '-' + 
					created.getFullYear();

				hubspotContactsList.items.push({
					contactId : contactId,
					name : contactName,		
					url : hubspotResult[index]['profile-url'],
					lifecyclestage : lifecycleStage,
					created : created_formatted	
				});
			});
		}

		if (!pwSdkObj) {
			console.log('no context object...fetching tickets for default email:' + company.domain)
			fetchHubspotContactsByCompany(company);
		}

	});