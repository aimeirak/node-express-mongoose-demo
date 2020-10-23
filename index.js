const  Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const authentication = require('./authentication');
const { isSchema } = require('joi');
const { urlencoded } = require('express');
const app = express();


// console.log(`NODE_ENV:${process.env.NODE_ENV}`);
// console.log(`App:${app.get('env')}`);
// console.log(`NODE_ENV:${process.env.NODE_ENV}`);
// console.log(`App:${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));

app.use(helmet());
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    console.log("morgan enabled"); 
}
app.use(logger);


app.use(authentication);

const PORT = process.env.PORT || 5000;

const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },    
];
// home page
app.get('/',(req,res)=>{
    res.send("Hello World");
});
// get all genrers

app.get('/api/genres',(req,res)=>{
    res.send(genres);
})

app.post('/api/genres',(req,res)=>{
    // if(!req.body.name || req.body.name<3){
    //     res.status(400).send("genre name is it can not be null or minimum of 3 charcter");
    //     return
    // }
    const {error} = validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    genre = {
        id:genres.length+1,
        name:req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

// get one genre

app.get('/api/genres/:id',(req,res)=>{ 
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(400).send('The genre with the given ID was not found.');
    res.send(genre);
});


app.put('/api/genres/:id',(req,res)=>{
    console.log("aime");
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(400).send('The genre with the given ID was not found.');
    const {error}  = validateGenre(req.body);
     if(error) return res.status(400).send(error.details[0].message);

     genre.name = req.body.name;
     res.send(genre);
});

app.delete('/api/genres/:id',(req,res)=>{
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre)
        return res.status(400).send('The genre with the given ID was not found.');
        const index = genres.indexOf(genre);
        genres.splice(index);
        res.send(genre);
});


app.listen(PORT,()=>{
    console.log(`we are running on port ${PORT}`);
});


// validation with Joi
function validateGenre(genre){
    console.log(genre);
    const schema =Joi.object({
        name:Joi.string() .min(6) .required(),

    });
    return schema.validate(genre);
}
