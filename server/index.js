const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const GOOGLE_CLIENT_ID = '1059874785832-e70d6k0o0o5b92ujkqllluilj5bdq7oh.apps.googleusercontent.com'


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.use(bodyParser.urlencoded())

app.get('/login', (req, res) => {
    const { redirect_uri, response_type, state } = req.query

    res.render('pages/login', {
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: redirect_uri,
        state,
        responseType: response_type
    })
})


app.post('/token', (req, res) => {
    const { code } = req.body;
    console.log(code);
    const result = {};
    if (!code || code.length <= 0) {
        result.error = 'no valid code!'
    } else {
        result.expires_in = 2592000
    }

    res.status(200).send(JSON.stringify(result))
})



app.listen(port, () => console.log(`Listing on port: ${port}!`))