const {Client} = require('pg')

const express =require('express')
const app=express()

app.use(express.json())

const con= new Client ({
    /**Change to render later */
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "password",
    database: "postgres"
})

app.listen(3000, () => {
    console.log("server is running...")
})

con.connect().then(()=> console.log("connected"))

/**Create the account */
app.post('/account/signup', (req, res)=>{
    const {username,password} = req.body

    if(password == null) {
        res.send("Password Required")
    }

    const insert_query = 'INSERT INTO "user" (username, password) VALUES ($1, $2)'
    con.query(insert_query, [username, password], (err, result)=> {
        if(err) {
            res.send(err)
        } else {
            res.send("SIGN UP SUCCESS")
        }
    })
}) 

/**User Login */
app.post('/account/login', (req, res)=>{
    const {username,password} = req.body

    /**check if username exist */
    const user_query = 'SELECT username FROM "user" WHERE "user".username=$1'
    con.query(user_query,[username], (err, result)=>{
        if(err) {
            res.send(err)
        } else {
            if(result==null) {
                res.send("Cannot find user")
            }
        }
    })
    
    /**check if password and username match */
    const pass_query = 'SELECT * FROM "user" WHERE "user".username=$1 AND "user".password=$2'
    con.query(pass_query,[username, password], async (err, result)=>{
        if(err) {
            res.send(err)
        } else {
            if(result==null) {
                res.send("Incorrect Password")
            }
            /** if it match, then set the userid in local storage*/
            const user_id = await result.rows[0];
            console.log(user_id);
            res.send(user_id.id);
        }

        
    })

}) 

/**Get User History */
app.get('/account/color_history/:id', async (req, res)=>{

    const user_id = req.params.id;

    const get_colors = 'SELECT "hex" FROM color WHERE user_id=$1'
    con.query(get_colors,[user_id], (err, result)=>{
        if(err) {
            res.send(err)
        } else {
            res.send(result.rows);
        }
    })
})

/**Post User History */
app.post('/account/:id/hex', (req, res)=>{

    const user_id = req.params.id;
    const {hex_code} = req.body;

    const set_color = 'INSERT INTO color ("hex", user_id) VALUES ($1, $2)'
    con.query(set_color,[hex_code, user_id], (err, result)=>{
        if(err) {
            res.send(err)
        } else {
            res.send("Successfully set color");
        }
    })
    
})
