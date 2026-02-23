const http = require('http');

http.get('http://localhost:3001/admin/products', (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        if (res.statusCode === 500) {
            // Find where "Error:" starts in the HTML or just print a bit of it
            const match = data.match(/<title>(.*?)<\/title>/);
            if (match) console.log("Title: ", match[1]);

            const errMatch = data.match(/Error: (.*?)<br/);
            if (errMatch) console.log("Error Message:", errMatch[0]);

            // Look for the react error in next.js
            const rawText = data.replace(/<[^>]*>?/gm, ''); // strips html
            const errorIndex = rawText.indexOf("Error");
            if (errorIndex > -1) {
                console.log(rawText.substring(errorIndex, errorIndex + 1000));
            }
        } else {
            console.log("Status is not 500, it is " + res.statusCode);
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
