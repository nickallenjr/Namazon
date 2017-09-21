var mysql = require('mysql');
var inquire = require('inquirer');
require('console.table')


var connection = mysql.createConnection({
	host: 'localhost',
	port: 8889,

	user: 'root',
	password: 'root',
	database: 'namazon'
});

connection.connect(function(err) {
	if (err) throw err;
	start();
})

function start() {
	connection.query("SELECT * FROM products", function(error, results) {
		if (error) throw error;
		console.table(results);
		pickOne();
	})
}

function pickOne() {
	inquire.prompt([
		{
			name: 'id',
			type: 'input',
			message: 'Enter the ID of the item you would like to buy: '
		}
	]).then(function(ansId) {
		var query = "SELECT item_id, item_name, price, stock_quantity FROM products WHERE ?";
		connection.query(query, { item_id: ansId.id }, function(err, res) {
			if (err) throw err;
			console.table(res);
			inquire.prompt([
				{
					name: 'units',
					type: 'input',
					message: 'How many units of the item would you like to buy?',
					validate: function (value) {
			      		var valid = !isNaN(parseFloat(value));
			      		return valid || 'Please enter a number';
		    		},
		    		filter: Number
				}
			]).then(function(ansAmount) {
				if (ansAmount.units > res[0].stock_quantity) {
					console.log('Insufficient Quantity!');
					start();
				}
				else {
					var math = res[0].stock_quantity - ansAmount.units;
					var query = "UPDATE products SET ? WHERE ?";
					connection.query(query, [{stock_quantity:math},{item_id:ansId.id}], function(err, res) {
						if (err) throw err;
						console.log('Purchase Complete!');
						start();
					})
				}
			})
		})
		
	})
}

//connection.end();