const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Tourist Signup
        console.log('\n1. Testing Tourist Signup...');
        try {
            const signupRes = await axios.post(`${API_URL}/auth/signup`, {
                email: 'tourist1@gmail.com',
                password: 'password123'
            });
            console.log('✅ Signup Success:', signupRes.data.message);
        } catch (error) {
            console.log('❌ Signup Failed:', error.response ? error.response.data : error.message);
        }

        // 2. Tourist Login
        console.log('\n2. Testing Tourist Login...');
        let touristToken = '';
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'tourist1@gmail.com',
                password: 'password123'
            });
            console.log('✅ Login Success:', loginRes.data.message);
            touristToken = loginRes.data.token;
        } catch (error) {
            console.log('❌ Login Failed:', error.response ? error.response.data : error.message);
        }

        // 3. Admin Login
        console.log('\n3. Testing Admin Login...');
        let adminToken = '';
        try {
            const adminLoginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@gmail.com',
                password: 'adminpassword123'
            });
            console.log('✅ Admin Login Success:', adminLoginRes.data.message);
            adminToken = adminLoginRes.data.token;
        } catch (error) {
            console.log('❌ Admin Login Failed:', error.response ? error.response.data : error.message);
        }

        // 4. Admin Create Organization
        console.log('\n4. Testing Admin Create Organization...');
        try {
            const createOrgRes = await axios.post(`${API_URL}/admin/create-organization`, {
                email: 'org1@gmail.com',
                password: 'orgpassword123'
            }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ Create Organization Success:', createOrgRes.data.message);
        } catch (error) {
            console.log('❌ Create Organization Failed:', error.response ? error.response.data : error.message);
        }

        // 5. Organization Login
        console.log('\n5. Testing Organization Login...');
        try {
            const orgLoginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'org1@gmail.com',
                password: 'orgpassword123'
            });
            console.log('✅ Organization Login Success:', orgLoginRes.data.message);
        } catch (error) {
            console.log('❌ Organization Login Failed:', error.response ? error.response.data : error.message);
        }

        // 6. Invalid Signup (Wrong Email)
        console.log('\n6. Testing Invalid Signup (Wrong Email)...');
        try {
            await axios.post(`${API_URL}/auth/signup`, {
                email: 'invalid@yahoo.com',
                password: 'password123'
            });
            console.log('❌ Failed: Should have rejected invalid email');
        } catch (error) {
            console.log('✅ Correctly Rejected:', error.response.data.message);
        }

        // 7. Invalid Signup (Short Password)
        console.log('\n7. Testing Invalid Signup (Short Password)...');
        try {
            await axios.post(`${API_URL}/auth/signup`, {
                email: 'valid@gmail.com',
                password: 'short'
            });
            console.log('❌ Failed: Should have rejected short password');
        } catch (error) {
            console.log('✅ Correctly Rejected:', error.response.data.message);
        }

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('Unexpected Error:', error);
    }
}

testAuth();
