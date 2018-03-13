
	var company = {
		domain : 'prosperworks.com'
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
				person.email = data.context.primary_email;
				fetchZendeskTicketsByEmail(person);
				console.log('CONTEXT OBJECT:' + data.context);
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
					debugger;
					console.log(result);
				},

				error: function(result) {
					console.log(result);
					zenTicketsList.status = 'error';
				}
			});
		}
		//$("button").on("click", fetchZendeskTicketsByEmail(person.email));

		if (!pwSdkObj) {
			console.log('no context object...fetching tickets for default email:' + company.domain)
			fetchHubspotContactsByCompany(company);
		}

	});