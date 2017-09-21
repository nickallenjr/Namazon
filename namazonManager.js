var mysql = require('mysql');
var inquire = require('inquirer');
require('console.table')


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',
	password: 'root',
	database: 'namazon'
});

connection.connect(function(err) {
	if (err) throw err;
	pickOne();
})

function toTitleCase(str)
	{
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

function pickOne() {
	inquire.prompt([
		{
			name: 'options',
			type: 'list',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			message: 'What would you like to do?'
		}
	]).then(function(ans) {
		if (ans.options == 'View Products for Sale') {
			connection.query("SELECT * FROM products", function(error, results) {
				if (error) throw error;
				console.table(results);
				pickOne();
			})
		}
		else if (ans.options == 'View Low Inventory') {
			connection.query("SELECT * FROM products WHERE stock_quantity <= 10", function(error, results) {
				if (error) throw error;
				console.table(results);
				pickOne();
			})
		}
		else if (ans.options == 'Add New Product') {
			inquire.prompt([
				{
					name: 'item',
					message: 'What is the name of the item?',
					type: 'input'
				},
				{
					name: 'department',
					message: 'What department is it in?',
					type: 'input'
				},
				{
					name: 'price',
					message: 'How much does it cost?',
					type: 'input',
					validate: function (value) {
			      		var valid = !isNaN(parseFloat(value));
			      		return valid || 'Please enter a number';
		    		},
		    		filter: Number
				},
				{
					name: 'quantity',
					message: 'How many are there?',
					type: 'input',
					validate: function (value) {
			      		var valid = !isNaN(parseFloat(value));
			      		return valid || 'Please enter a number';
		    		},
		    		filter: Number
				}
			]).then(function(ans) {
				var query = `INSERT INTO products (item_name, department_name, price, stock_quantity) VALUES ('${toTitleCase(ans.item)}', '${toTitleCase(ans.department)}', ${ans.price}, ${ans.quantity})`;
				connection.query(query, function(err, results) {
					if (err) throw err;
					console.log('Item has been added.');
					pickOne();
				})
			})
		}
		else if (ans.options == 'Add to Inventory') {
			inquire.prompt([
				{
					name: 'item',
					type: 'input',
					message: 'Enter the Id of the product you would like to update the inventory of:',
					validate: function (value) {
			      		var valid = !isNaN(parseFloat(value));
			      		return valid || 'Please enter a number';
		    		},
		    		filter: Number
				},
				{
					name: 'update',
					type: 'input',
					message: 'How much would you like to add to inventory?',
					validate: function (value) {
			      		var valid = !isNaN(parseFloat(value));
			      		return valid || 'Please enter a number';
		    		},
		    		filter: Number
				}
			]).then(function(ans) {
				connection.query("SELECT item_id, item_name, price, stock_quantity FROM products WHERE ?", {item_id:ans.item}, function(err, res) {
					if (err) throw err;
					var math = res[0].stock_quantity += ans.update;
					connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity:math},{item_id:ans.item}], function(err, res) {
						console.log('Inverntoy Updated');
						pickOne();
					})	
				})
			})
		}
	})
}