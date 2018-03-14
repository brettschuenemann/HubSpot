
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

		zenTicketsList = new Vue({
			el: '#zenTicketsList',
			data: {
			user: '',
			items: [],
			status: 'new',
			newTicketUrl: 'https://d3v-prosperworksdev.zendesk.com/hc/en-us/requests/new'
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
				},

				error: function(result) {
					console.log(result);
					zenTicketsList.status = 'error';
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
				},

				error: function(result) {
					console.log(result);
					zenTicketsList.status = 'error';
				}
			});
		}

		if (!pwSdkObj) {
			console.log('no context object...fetching tickets for default email:' + company.domain)
			fetchHubspotContactsByCompany(company);
		}

	});