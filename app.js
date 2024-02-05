const { createHash } = require('node:crypto')
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const comments = [];
const app = express();
const readline = require('node:readline');
const ws = require('ws');
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer');
const db_manager = require("./db_manager");
var vald = require('validator');


let views_cof = 0;
var smtp_relay = nodemailer.createTransport({

  host: "",
  port: 587,
  auth: {
    user: '',
    pass: ''
  }
});

articles = db_manager.load_db("articles_db/metadata")


async function loadMessages() {
  const strm = fs.createReadStream('db-pseudo/message.txt');

  const scanner = readline.createInterface({
    input: strm,
    crlfDelay: Infinity,
  });

  for await (const line of scanner) {
    comments.unshift(JSON.parse(line));
  }
}

async function loadViews() {
  const strm = fs.createReadStream('db-pseudo/views.txt');

  const scanner = readline.createInterface({
    input: strm,
    crlfDelay: Infinity,
  });

  for await (const line of scanner) {
    views_cof = parseInt(line);
  }
}

loadMessages();
loadViews();
const wsServer = new ws.Server({ noServer: true });
server = app.listen(42013, () => {
  console.log(`Express is running...`);
});

app.set('view engine', 'ejs');
app.use(express.static('views/pages'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req, res) => {
  res.render('pages/main');

});
app.get('/guestbook', (req, res) => {
  res.render('pages/guestbook');
});

app.get('/essays', (req, res) => {
  res.render('pages/essays');
});

app.get('/my-garden', (_, res) => {
  res.render('pages/my-garden');
});
app.get('/article/:title', (req, res) => {
  console.log(req.params.title);
  fs.readFile(path.join(__dirname, `articles_db/${req.params.title}.html`)
    , { encoding: 'utf-8' }, function (err, data) {
      if (!err) {

        res.render('pages/article', {
          title: articles[req.params.title].title,
          text: data,
          description: `\"${articles[req.params.title].shrtdescr}\"`,
          css: `/styles/${articles[req.params.title].css}.css`,
          js: `/js/${articles[req.params.title].js}.js`,
          img: `"https://www.theworkerthread.com${articles[req.params.title].img}"`,
          keywords: articles[req.params.title].tags.toString()
        });
      } else {
        console.log(err);
      }
    });
});

app.get('/tool/:title', (req, res) => {
  console.log(req.params.title);
  fs.readFile(path.join(__dirname, `tools/${req.params.title}.html`)
    , { encoding: 'utf-8' }, function (err, data) {
      if (!err) {
        fs.readFile(path.join(__dirname, `tools/metadata/${req.params.title}.json`)
          , { encoding: 'utf-8' }, function (err_meta, data_meta) {
            if (!err_meta) {
              let tmp = JSON.parse(data_meta);
              res.render('pages/article', {
                title: tmp.title,
                text: data,
                css: `/styles/${tmp.css}.css`,
                js: `/js/${tmp.js}.js`,
                description: `\"${tmp.shrtdescr}\"`,
                img: `"https://www.theworkerthread.com${tmp.img}"`,
                keywords: tmp.tags.toString()
              });
            } else {
              console.log(err_meta);
            }
          });

      } else {
        console.log(err);
      }
    });
});
app.get('/webart', (req, res) => {
  res.render("pages/webart");
});

app.get('/news', (req, res) => {
  res.render("pages/news");
});
app.get('/aboutus', (req, res) => {
  res.render("pages/aboutus");
});
app.get('/demo/fakebook', (req, res) => {
  res.render("pages/fakebook");
});
app.get('/explanatory', (req, res) => {

  res.render("pages/explanatory");
});
app.get('/hilberts-gallery', (req, res) => {

  res.render("pages/hilberts-gallery");
});
app.get('/hilberts-gallery/', (req, res) => {

  res.render("pages/hilberts-gallery");
});
app.get('/tools', (req, res) => {
  res.render("pages/tools");
});

app.get('/city-of-the-future', (req, res) => {
  views_cof += 1;
  fs.writeFileSync('db-pseudo/views.txt', views_cof.toString());
  res.render("pages/city-of-the-future");
});

app.get('/views/cof', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify({ "val": views_cof }));
});

app.get('/comments/:prevTime', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let i = 0;
  while (i < comments.length) {
    if (comments[i].time < req.params.prevTime) break;
    i += 1;
  }

  console.log(i);
  res.end(JSON.stringify(comments.slice(i, i + 10)));
});

app.get('/tags/:tag', (req, res) => {

  res.render('pages/tag', {
    tag: req.params.tag,

  });

});

app.get('/content/:idx&:filter', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.params.filter == 0) {
    res.end(JSON.stringify(Object.keys(articles).map(ttl => articles[ttl]).sort((a, b) => b.interest - a.interest).slice(req.params.idx, req.params.idx + 10)));
  } else {

    res.end(JSON.stringify(Object.keys(articles).map(ttl => articles[ttl]).filter(el => el.tags.includes(req.params.filter)).sort((a, b) => b.interest - a.interest).slice(req.params.idx, req.params.idx + 10)));
  }


});
app.post('/guest-submit', (req, res) => {
  console.log(req.body);
  let infoBody = req.body;
  if (!infoBody.username || !infoBody.textMessage) {
    res.redirect("/guestbook");
    return;
  }
  infoBody.username = vald.escape(infoBody.username);
  infoBody.textMessage = vald.escape(infoBody.textMessage);
  infoBody.time = Date.now();
  comments.unshift(infoBody);
  fs.appendFileSync('db-pseudo/message.txt', JSON.stringify(infoBody));
  fs.appendFileSync('db-pseudo/message.txt', "\n");
  res.redirect("/guestbook");
});


app.post('/mail-submit', (req, res) => {
  console.log("sending mail", req.body, req.data)
  let infoBody = req.body;

  if (infoBody.mail != undefined) {
    res.redirect("/article/email-spoofing");
    smtp_relay.sendMail({
      from: {
        name: 'The FBI',
        address: 'fbi@gov.com'
      }, to: infoBody.mail,
      text: 'This is a demonstration from https://theworkerthread.com/article/email-spoofing',
      subject: 'Spoof Demonstration', headers: {
        'message-header': "From: The FBI <fbi@gov.com>"
      }
    }, (e, i) => console.log(e, i));
  }


});

// Game related stuff:
// I should refactor but too lazy

const sess_maps = new Map();

app.get('/break-me', (req, res) => {
  let sess = req.cookies.session;
  res.set('Cache-Control', 'no-store')
  if (sess == undefined || sess_maps.get(sess) == undefined) {
    let sess = createHash('sha256').update(req.ip + Math.random().toString()).digest('hex');
    //
    sess_maps.set(sess, { pg: "/break-me", stt: 0, lives: 5, key: "==4w4-k0fP32wM02-XoP==" });
    res.cookie("session", sess);

  } else {
    if (sess_maps.get(sess).stt == 3) {
      res.redirect("/demon")
      return
    }

  }
  res.render("pages/break-me");
});

app.get('/demon', (req, res) => {
  let sess = req.cookies.session;
  let key = req.cookies.key;
  if (sess == undefined || sess_maps.get(sess) == undefined || key == undefined || sess_maps.get(sess).key != key) {
    res.redirect("/break-me")
  } else {


    res.render(`pages/demon`)
  }

});
app.get('/room', (req, res) => {
  let sess = req.cookies.session;
  let key = req.cookies.key;
  if (sess == undefined || sess_maps.get(sess) == undefined || key == undefined || sess_maps.get(sess).key != key) {
    res.redirect("/break-me")
  } else {
    sess_maps.get(sess).stt = 3;
    res.render(`pages/room`)
  }

});



server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

wsServer.on('connection', socket => {

  socket.on('message', message => {
    let jsonmsg = JSON.parse(message.toString());
    if (jsonmsg.id == undefined || jsonmsg.sess == undefined || !sess_maps.has(jsonmsg.sess)) {
      return;
    } else if (jsonmsg.id == 1) {

      socket.send(JSON.stringify({ "id": 0, "key": sess_maps.get(jsonmsg.sess).key, "st": sess_maps.get(jsonmsg.sess).stt }))
    } else if (jsonmsg.id == 2) {
      if (jsonmsg.key != undefined && jsonmsg.key == sess_maps.get(jsonmsg.sess).key) {
        sess_maps.get(jsonmsg.sess).stt = 2;
        console.log(jsonmsg.sess, " has escaped the room!")
      }
    }
  });
});

