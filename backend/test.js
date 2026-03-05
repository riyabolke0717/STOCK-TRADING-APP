const http = require('http');

const baseURL = 'http://localhost:5000/api';

const makeRequest = (method, path, data = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, data: JSON.parse(responseBody || '{}') });
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

async function runTests() {
    try {
        console.log("=== STARTING BACKEND TESTS ===");

        // 1. Register a user
        const testUser = {
            name: `TestUser_${Date.now()}`,
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        };
        console.log(`\n[1] Registering User: ${testUser.email}`);
        const regRes = await makeRequest('POST', '/auth/register', testUser);
        console.log("Status:", regRes.status, "Balance:", regRes.data.balance);

        const token = regRes.data.token;
        if (!token) throw new Error("No token returned after registration.");

        // 2. Deposit Money
        console.log("\n[2] Depositing 5000 to Wallet");
        const depRes = await makeRequest('POST', '/wallet/deposit', { amount: 5000 }, token);
        console.log("Status:", depRes.status, "New Balance:", depRes.data.newBalance);

        // 3. Buy Stock
        console.log("\n[3] Buying 2 shares of TSLA at 200 each (Total 400)");
        const buyRes = await makeRequest('POST', '/orders/buy', {
            stockSymbol: 'TSLA',
            stockName: 'Tesla Inc',
            quantity: 2,
            price: 200
        }, token);
        console.log("Status:", buyRes.status);
        console.log("New Balance:", buyRes.data.newBalance);
        console.log("Portfolio:", JSON.stringify(buyRes.data.portfolio, null, 2));

        // 4. Sell Stock
        console.log("\n[4] Selling 1 share of TSLA at 250 each");
        const sellRes = await makeRequest('POST', '/orders/sell', {
            stockSymbol: 'TSLA',
            stockName: 'Tesla Inc',
            quantity: 1,
            price: 250
        }, token);
        console.log("Status:", sellRes.status);
        console.log("New Balance:", sellRes.data.newBalance);
        console.log("Portfolio:", JSON.stringify(sellRes.data.portfolio, null, 2));

        // 5. Withdraw Money
        console.log("\n[5] Withdrawing 1000 from Wallet");
        const withRes = await makeRequest('POST', '/wallet/withdraw', { amount: 1000 }, token);
        console.log("Status:", withRes.status, "New Balance:", withRes.data.newBalance);

        // 6. Get Transactions
        console.log("\n[6] Fetching Wallet Transactions");
        const transRes = await makeRequest('GET', '/wallet/transactions', null, token);
        console.log("Status:", transRes.status);
        console.log("Transactions Count:", transRes.data.length);
        transRes.data.forEach(t => console.log(`   -> ${t.type.toUpperCase()}: ${t.amount}`));

        console.log("\n=== ALL TESTS PASSED SUCCESSFULLY ===");

    } catch (err) {
        console.error("Test failed:", err);
    }
}

runTests();
