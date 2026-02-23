const http = require('http');

http.get('http://localhost:3001/admin/api/products', (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        try {
            console.log(JSON.parse(data));
        } catch {
            console.log(data);
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
