const express = require('express');
const app = express();
const bodyparser = require('body-parser');

let data = require('./jobs');
let initialJobs = data.jobs;
let addedJobs = [];


let users = [
    { id: 1, role: 'admin', email: "a@gmail.com", password: "a", nickname: 'Banane' },
    { id: 2, role: 'user', email: "z@gmail.com", password: "z", nickname: 'Zanane' }
];

const secret = 'yolo';
const jwt = require('jsonwebtoken');

const getAllJobs = () => {
    return [...addedJobs, ...initialJobs];
};

app.use(bodyparser.json());

app.use((req, res, next) => {
    console.log(req.params);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type, authorization");
    next();
})

const api = express.Router();
const auth = express.Router();

auth.post('/login', (req, res) => {
    if (req.body) {
        const email = req.body.email.toLowerCase();
        const password = req.body.password.toLowerCase();
        const index = users.findIndex(u => u.email === email);
        if (index > -1 && users[index].password === password) {
            let user = users[index];

            if (!user.role) {
                user.role = 'user';
            }

            token = jwt.sign({ iss: 'http://localhost:4201', email: req.body.email, role: user.role, nickname: user.nickname }, secret);
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Identifiants incorrects" })
        }
    } else {
        res.status(500).json({ success: false, message: "Identifiants manquants" })
    }
});

auth.post('/register', (req, res) => {
    if (req.body) {
        const email = req.body.email.toLowerCase().trim();
        const password = req.body.password.toLowerCase();
        const nickname = req.body.nickname.toLowerCase();

        users = [{ id: Date.now(), email: email, password: password, nickname: nickname }, ...users];
        res.json({ success: true, users: users })
    } else {
        res.json({ success: false, message: 'Création a échoué' })
    }
});

api.get('/jobs', (req, res) => {
    res.json(getAllJobs());
});



const checkUserToken = (req, res, next) => {
    // Authorization : Bearer ..
    console.log(req.params);
    if (req.params.email) {
        if (!req.header('authorization')) {
            return res.status(401).json({ success: false, message: "Pas de Header d'authentification" });
        }
        const authorizatonParts = req.header('authorization').split(' ');
        let token = authorizatonParts[1];
        const decodedToken = jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Token invalid' })
            } else {
                next();
            }
        });
    } else {
        next();
    }
}

const checkUserTokenED = (req, res, next) => {
    // Authorization : Bearer ..
    console.log('checkUserTokenED', req.params);

    next();

}

/*api.get('/jobs/:id', (req, res) => {
    
        console.log('/jobs/:id');
        const id = parseInt(req.params.id, 10);
        const job = getAllJobs().filter(j => j.id === id);
    
        if (job.length === 1) {
            res.json({ success: true, job: job[0] });
        } else {
            res.json({ success: false, message: 'No Job Find' });
        }
    });*/

api.get(['/jobs/:email','/jobs/:id'], checkUserToken, (req, res) => {
    console.log('/jobs/:email');

    const id = parseInt(req.params.id, 10);
    const email = req.params.email;

    if (email) {
        const jobs = getAllJobs().filter(job => job.email === email);
        console.log(jobs);
        return res.json({ success: true, jobs: jobs });
    } else if (id) {
        const job = getAllJobs().filter(j => j.id === id);
    
        if (job.length === 1) {
            res.json({ success: true, job: job[0] });
        } else {
            res.json({ success: false, message: 'No Job Find' });
        }
    
    } else {
        return res.status(401).json({message : "failed routing"})
    }
   

 

});

api.post('/jobs', checkUserToken, (req, res) => {
    const job = req.body;
    addedJobs = [job, ...addedJobs];
    console.log(job);
    res.json(job);
});


api.get('/search/:term/:place?', (req, res) => {
    const term = req.params.term.toLowerCase().trim();
    let place = req.params.place;
    let jobs = getAllJobs().filter(j => (j.description.toLowerCase().includes(term) || j.title.toLowerCase().includes(term)));
    if (place) {
        place = place.toLowerCase().trim();
        jobs = jobs.filter(j => (j.city.toLowerCase().includes(place)));

    }
    res.json({ success: true, jobs })
})






app.use('/api', api);
app.use('/auth', auth);

const port = 4201;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});