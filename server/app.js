const express = require('express');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const e = require('express');
const { parse, differenceInHours } = require('date-fns');

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, 'SET.db');

let db = null;

const initializeDBAndServer = async () =>  {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(5000, () => {
            console.log('Server Running at http://localhost:5000/');
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
}

initializeDBAndServer();

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers['authorization'];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(' ')[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send('Invalid JWT Token');
    } else {
        jwt.verify(jwtToken, 'Employee Tracker', async (error, payload) => {
            if (error) {
                response.status(401);
                response.send('Invalid JWT Token');
            } else {
                request.username = payload.username;
                next();
            }
        });
    }

}

// Register API

app.post('/register/', async (request, response) => {
    const {name, email, mobile, securityQues, securityAns, username, password, photo, admin} = request.body;
   
    const selectUserQuery = `
        SELECT *
        FROM users
        WHERE username = '${username}' OR email = '${email}' OR mobile = '${mobile}';`;

    
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        const createUserQuery = `
            INSERT INTO RequestReg (name, email, mobile, security_q, security_ans, username, password, photo, admin)
            VALUES ('${name}', '${email}', '${mobile}', '${securityQues}', '${securityAns}', '${username}', '${password}', '${photo}', ${admin});`;
        await db.run(createUserQuery);
        response.send({success:'User created successfully'});
    } else {
        response.status(400);
        response.send({error: 'User already exists'});
    }
})

// Get all Registerers API

app.get('/request/register/all/', authenticateToken, async (request, response) => {
    const getUserQuery = `
        SELECT *
        FROM RequestReg;`;
    const usersArray = await db.all(getUserQuery);
    response.send(usersArray);
})

// Accept Registration API

app.post('/request/register/accept/:username', authenticateToken, async (request, response) => {
    const {username} = request.params;
   
    const selectUserQuery = `
        SELECT *
        FROM RequestReg
        WHERE username = ?`;
    
    try {
        const dbUser = await db.get(selectUserQuery, [username]);
        if (dbUser === undefined) {
            response.status(400);
            response.send({error: 'Invalid user'});
        }
        const createUserQuery = `
            INSERT INTO users (name, email, mobile, security_q, security_ans, username, password, photo, admin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.run(createUserQuery, [dbUser.name, dbUser.email, dbUser.mobile, dbUser.security_q, dbUser.security_ans, dbUser.username, dbUser.password, dbUser.photo, dbUser.admin]);

        const deleteUserQuery = `
            DELETE FROM RequestReg
            WHERE username = ?`;
        await db.run(deleteUserQuery, [username]);
        response.send({success:'User created successfully'});
    } catch (error) {
        response.status(500).send({error: 'An error occurred while processing your request.'});
    }
});

// Reject Registration API

app.delete('/request/register/reject/:username', authenticateToken, async (request, response) => {
    const {username} = request.params;
    const deleteUserQuery = `
        DELETE FROM RequestReg
        WHERE username = ?`;
    await db.run(deleteUserQuery, [username]);
    response.send({success:'User rejected successfully'});
})

// Login API

app.post('/login/', async (request, response) => {
    const {username, password} = request.body;
    console.log(request.body)
    const selectUserQuery = `
        SELECT *
        FROM users
        WHERE username = '${username}';`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        response.status(400);
        response.send({error: 'Invalid user'});
    } else {
        if (dbUser.password === password) {
            const payload = {username: username};
            const jwtToken = jwt.sign(payload, 'Employee Tracker');
            response.send({jwtToken, admin: dbUser.admin, username: dbUser.username});
        } else {
            response.status(400);
            response.send({error: 'Invalid password'});
        }
    }
})

// Forgot Password API 

app.post('/forgot/', async (request, response) => {
    const {username, securityQues, securityAns, newPassword} = request.body;
    const selectUserQuery = `
        SELECT *
        FROM users
        WHERE username = '${username}';`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        response.status(400);
        response.send({error:'Invalid user'});
    } else {
        if (dbUser.security_q === securityQues && dbUser.security_ans === securityAns) {
            if (newPassword === dbUser.password) {
                response.status(400);
                response.send({error: 'New password cannot be same as old password'});
            } else {
                const updateUserQuery = `
                    UPDATE users
                    SET password = '${newPassword}'
                    WHERE username = '${username}';`;
                await db.run(updateUserQuery);
                response.send({success: 'Password updated successfully'});
            }
        } else {
            response.status(400);
            response.send({error:'Invalid security question or answer'});
        }
    }
})

// Dashboard API 

app.get('/dashboard/:id', authenticateToken, async (request, response) => {
    console.log('triggered')
    const {id} = request.params;
    const getUserQuery = `
        SELECT username
        FROM users 
        where username = '${id}';`;
    const usersArray = await db.all(getUserQuery);
    response.send(usersArray);
})


// Add user History API

app.post('/history/login/', authenticateToken, async (request, response) => {
    const {username, date, loginTime} = request.body;
    const checkUserLoginQuery = `
        SELECT *
        FROM history
        WHERE username = '${username}' AND date = '${date}';`;
    const dbUser = await db.get(checkUserLoginQuery);
    
    if (dbUser === undefined) {
        console.log(dbUser)
        const createUserQuery = `
            INSERT INTO history (username, date, login_time)
            VALUES ('${username}', '${date}', '${loginTime}');`;
        await db.run(createUserQuery);
        response.send({success: 'User Login created successfully'});
    } else { 
        response.status(400);
        response.send({error: 'User already logged in'});
    }
})


// Update user History API

app.put('/history/logout/', authenticateToken, async (request, response) => {
    const {username, logoutTime} = request.body;
    console.log(username)
    const checkUserLoginQuery = `
        SELECT *
        FROM history
        WHERE username = '${username}';`;
    const dbUser = await db.get(checkUserLoginQuery);
    console.log(dbUser)
    const time1 = dbUser.login_time;
    const time2 = logoutTime;

    const date1 = parse(time1, 'hh:mm:ss a', new Date());
    const date2 = parse(time2, 'hh:mm:ss a', new Date());

    const diff = differenceInHours(date2, date1);

    console.log(diff);
    if (diff < 6) {
        response.status(400);
        response.send({diff, error: 'Minimum 6 hours of work is required'});
    } else {
        const createUserQuery = `
            UPDATE history 
            SET logout_time = '${logoutTime}'
            WHERE username = '${username}' AND date = '${date}';`;
        await db.run(createUserQuery);
        response.send({success:'User history updated successfully'});
    }
})

// Get user History API

app.get('/history/all', authenticateToken, async (request, response) => {
    const getUserQuery = `
        SELECT *
        FROM history;`;
    const usersArray = await db.all(getUserQuery);
    response.send(usersArray);
})

// Add Tracker API

app.post('/tracker/', authenticateToken, async (request, response) => {
    const {username, date, time, remarks} = request.body;
    const createUserQuery = `
        INSERT INTO tracker (username, date, time, remarks)
        VALUES ('${username}', '${date}', '${time}', '${remarks}');`;
    await db.run(createUserQuery);
    response.send({success: 'User tracker created successfully'});
})

// Get Tracker API

app.get('/tracker/:id', authenticateToken, async (request, response) => {
    const {id} = request.params;
    console.log(id)
    const getUserQuery = `
        SELECT *
        FROM tracker 
        where username = '${id}';`;
    const usersArray = await db.all(getUserQuery);
    response.send(usersArray);
})
