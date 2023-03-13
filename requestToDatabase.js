
const mysql = require("mysql")
/**
 * 
 * @param {string} query - The query string that will be executed in database
 * @param {array} params - Array of parameters containing values to the query string
 * @returns Promise, that can be resolved or rejected depending on connection  
 */
function requestToDatabase(query, params) {
	return new Promise((resolve, reject) => {
		const conn = mysql.createConnection({
			host: process.env.HOST,
			user: process.env.USER,
			database: process.env.DATABASE,
			password: process.env.PASSWORD
		})

		
		conn.connect(err => {
			if (err) {
				// return res.status(500).send({
				// 	statusCode: 500,
				// 	msg: "Database connection error"
				// })
				return reject({
					statusCode: 500,
					msg: "Database connection error"
				})
			}
			conn.query(query, params, (err, result, fields) => {
				// console.log(params)
				if (err) {
					// return res.status(500).send({
					// 	statusCode: 500,
					// 	msg: "Database error"
					// })
					return reject({
						statusCode: 500,
						msg: "Database error"
					})
				}
				if(result.length == 0){
					return reject({msg: "No data"})
				}
				return resolve(result)
			})
			conn.end()
		})
	})

}

module.exports = requestToDatabase;