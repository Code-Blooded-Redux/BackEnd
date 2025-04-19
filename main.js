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

con.connect().then(()=> console.log("connected"))

/**Create the account */
app.post('/user', (req, res)=> {
    const {username,password}=req.body

    const insert_query = 'INSERT INTO "user" (username, password) VALUES ($1, $2)'

    con.query(insert_query, [username,password], (err, result)=> {
        if(err) {
            console.log("FAILED")
            res.send(err)
        } else {
            console.log(result)
            res.send("POSTED DATA")
        }
    })
})

/**Log user in */
    app.post('/user/login', async (req, res)=> {
        const {username,password}=req.body
    
        if(username == null) {
            return res.status(400).send('Cannot find user')
        }
        try {
            await fetchPass(username, password);
            res.send("Entered")
        } catch {
            res.send("Failed")
        }
    })

async function fetchPass(username, password) {
    var response = ''; 
    const fetch_query='SELECT * FROM "user" WHERE username=$1'
    con.query(fetch_query, [username],(err, result)=> {
        if(err) {
            console.log("FETCH PASS FAIL")
        } else {
            response = result.rows[0].password
            console.log('password retrieved')
            console.log(response)
            if(password == response) {
                console.log("Password correct")
                return true;
            } else {
                console.log("Password Incorrect")
                return false;
            }
        }
    })
}

app.listen(3000, () => {
    console.log("server is running...")
})
