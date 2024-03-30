var mysql2 = require('mysql2');

const connection = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'expence',
    port: '3308' // Change this port if necessary
}).promise();


async function isLogin({ email, password }) {
    try{
        const [result] = await connection.query(`select * from master where emailid="${email}" AND password="${password}"`);
        if(result){
            return result[0];
        }
    }catch(error){
        console.log(error)
       return false; 
    }
}

async function registerUser(email, password){
    console.log(email, password);
    try{
        await connection.query(`insert into master( emailid, password) values ('${email}', '${password}')`);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}
async function addExpense(name, total, date) { 
    try { 
        await connection.query(`insert into dataofuser(name, total, date) values ('${name}', '${total}', STR_TO_DATE('${date}', '%d-%m-%Y'))`); 
        return true; 
    } catch (err) { 
        console.log(err); 
        return false; 
    } 
}
async function getExpenses() {
    [result] = await connection.query('SELECT * FROM dataofuser');
    return result;
}

module.exports = {
    registerUser,
    isLogin,
    addExpense,
    getExpenses
};
