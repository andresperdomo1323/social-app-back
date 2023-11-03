const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/config');
const usersRouter = require('./routes/user.routes');
const publicationRouter = require('./routes/publication.routes');
const uploadRouter = require('./routes/upload.routes');//jean
const path = require('path');//jean



class server {
    constructor(){
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors( {origin:'http://localhost:4200'} ));
        this.app.use('/api/users', usersRouter),
        this.app.use('/api/publications', publicationRouter);
        //Avatar upload/handleUpload/jean
        this.app.use('/api/uploads', uploadRouter);
        this.app.use('/uploads', express.static("upload"));
        this.app.get('/api/handleUpload', (req, res) => {
            res.sendFile(path.join(__dirname, 'backend', 'handleUpload.js'));
          });
        this.port = process.env.PORT;
        // connect to database
        connectDB();
        this.server = http.createServer(this.app);
    }
    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }
    execute(){
        this.middlewares();
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = server;