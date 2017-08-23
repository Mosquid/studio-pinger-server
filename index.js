var express      = require('express');
var app          = express();
var expressWs    = require('express-ws')(app);
var enableWs     = require('express-ws');
var cors         = require('cors')
enableWs(app)

const agents = {}

app.use(cors())

app.get('/all', (req, res, next) => {
	const keys = Object.keys(agents)
	
	return res.json({agents: keys})
})

app.ws('/', function(ws, req) {
	ws.close()
})

app.ws('/:id', function(ws, req) {
	const id = req.params.id
	console.log('meet new user:', id);
	if (!id)
		ws.close()

	agents[id] = ws

	ws.on('close', function(msg) {
		console.log(id, 'got disconnected');
		if (agents.hasOwnProperty(id))
			delete agents[id]
	});
});
app.get('/:id/:from', function(req, res, next) {
	const id = req.params.id
	const by = req.params.from || false

	if (agents.hasOwnProperty(id)) {
		agents[id].send(by)
	} else {
		return res.end('<h1>' + id + '? We don\'t know this person...</h1>');		
	}

  res.end('<h1>' + id + ' succesfully pinged</h1>');
});

app.listen(7777);
