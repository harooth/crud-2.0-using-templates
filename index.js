const express = require("express");
const path = require("path")
const requestToDatabase = require("./requestToDatabase")


const PORT = process.env.PORT || 3001;

let app = express();
// app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")


app.get("/", (req, res) => {
	// res.redirect('index.html')
	const query = "SELECT * FROM test";

	requestToDatabase(query)
		.then(data => {
			res.render("main", {data});
		})
		.catch(err => {
			res.render("error", {err});
		})
})


app.get("/single/:id", (req, res) => {
	const query = "SELECT * FROM test WHERE id = ?";
	const params = [req.params.id]
	// console.log(params)
	requestToDatabase(query, params)
	.then(data => {
		res.render("single", {data: data[0]});
	})
	.catch(err => {
		res.render("error", {err});
	})
}) 


app.get("/create", (req, res)=>{
	res.render("create");
})


app.post("/create", (req, res)=>{
	const { name, email, password } = req.body;
	const query = "INSERT INTO test(name, email, password) VALUES (?, ?, ?)";
	const params = [name, email, password];

	requestToDatabase(query, params)
	.then(data => {
		const info = {
			msg: "Inserted successfully"
		}
		res.render("info", {info});
	})
	.catch(err => {
		res.render("error", {err});
	})
	
})

app.get("/delete/:id", (req, res)=>{
	const query = "DELETE FROM test WHERE id = ?";
	const params = [req.params.id];
	requestToDatabase(query, params)
	.then(data => {
		if(data.affectedRows == 0) {
			return res.render("error", {err:{msg:"Nothing to delete"}})
		}
		res.render("info", {info:{msg:"Deleted successfully"}});
	})
	.catch(err => {
		res.render("error", {err});
	})
})

app.get("/update/:id", (req, res)=>{
	const query = "SELECT * FROM test WHERE id = ?";
	const params = [req.params.id]
	// console.log(params)
	requestToDatabase(query, params)
	.then(data => {
		res.render("update", {data: data[0]});
	})
	.catch(err => {
		res.render("error", {err});
	})
})

app.post("/update", (req, res)=>{
	const { id, name, email, password } = req.body;
	const query = "UPDATE test SET name = ?, email = ?, password = ? WHERE id = ?";
	const params = [name, email, password, id];
	requestToDatabase(query, params)
	.then(data => {
		const info = {
			msg: "Updated successfully"
		}
		res.render("info", {info});
	})
	.catch(err => {
		res.render("error", {err});
	})
})






app.get("/delay", (req, res) => {
	setTimeout(() => {
		return res.send({ "msg": "delay response" });
	}, 5000)
	// res.send({"resp": "ok"})
})





app.use((req, res)=>{
	res.render("error", {err:{msg:"404 not found"}})
})

// app.listen(process.env.PORT)
app.listen(PORT, 'localhost'); 