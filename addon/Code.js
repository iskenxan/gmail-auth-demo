var scopes = [
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.addons.execute',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly'
]


function getService() {
  return OAuth2.createService('Demo Auth')
    .setAuthorizationBaseUrl('https://005d5076.ngrok.io/login')
    .setTokenUrl('https://005d5076.ngrok.io/token')
    .setClientId('1059874785832-ics2tbrsjrjeu7dsm5pj30ak8cauj9bq.apps.googleusercontent.com')
    .setClientSecret('dj1ZajNF9xEQpCt4zebBCZjP')
    .setScope(scopes.join(' '))
    .setCallbackFunction('authCallback')
    .setCache(CacheService.getUserCache())
    .setPropertyStore(PropertiesService.getUserProperties())
}


function create3PAuthorizationUi() {
	var service = getService()
	var authUrl = service.getAuthorizationUrl()
	var loginButton = CardService.newTextButton()
		.setText('Login')
		.setAuthorizationAction(CardService.newAuthorizationAction()
			.setAuthorizationUrl(authUrl))

	var promptText = 'Please login first'

	var card = CardService.newCardBuilder()
		.addSection(CardService.newCardSection()
			.addWidget(CardService.newTextParagraph()
				.setText(promptText))
			.addWidget(loginButton)
			).build()
	return [card]
}


function authCallback(callbackRequest) {
	Logger.log("Run authcallback!")
	const authorized = getService().handleCallback(callbackRequest)

	console.log(authorized)
	return HtmlService.createHtmlOutput('Success! <script>setTimeout(function() { top.window.close() }, 1)</script>')
}


function checkAuth() {
  var service = getService()
  if (service.hasAccess()) return

  CardService.newAuthorizationException()
    .setAuthorizationUrl(service.getAuthorizationUrl())
    .setResourceDisplayName("Display name to show to the user")
    .setCustomUiCallback('create3PAuthorizationUi')
    .throwException()
}


function buildAddOn(e) {
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  checkAuth()
  var section = CardService.newCardSection()

  var textWidget = CardService.newTextParagraph().setText('Hello World')

  section.addWidget(textWidget);

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
    .setTitle('Addon Demo'))
    .addSection(section)
    .build();

  return [card];
}