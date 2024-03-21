const dbService = require("./db");

describe('dbService', () => {
    const db = dbService.getDbServiceInstance();
    afterAll(async () => {
        await db.closeConnection();
    });

    // Test for authenticateUser function
    describe('authenticateUser', () => {
        test('should throw an error if username is missing', async () => {
            // Mock data with missing username
            const username = '';
            const password = 'admin123';
        
            // Call the function and expect it to throw an error
            await expect(db.authenticateUser(username, password)).rejects.toThrow('Username and password are required.');
        });
    
        test('should throw an error if password is missing', async () => {
            // Mock data with missing password
            const username = 'admin@google.com';
            const password = '';
        
            // Call the function and expect it to throw an error
            await expect(db.authenticateUser(username, password)).rejects.toThrow('Username and password are required.');
        });
    
        test('should throw an error if both username and password are missing', async () => {
            // Mock data with missing username and password
            const username = '';
            const password = '';
        
            // Call the function and expect it to throw an error
            await expect(db.authenticateUser(username, password)).rejects.toThrow('Username and password are required.');
        });
    
        test('should not throw an error if both username and password are provided', async () => {
            // Mock valid username and password
            const username = 'admin@google.com';
            const password = 'admin123';
    
            // Call the function and expect it to resolve without throwing an error
            await expect(db.authenticateUser(username, password)).resolves.toBeDefined();
        });

        test('should reject with an error if an error occurs during database query', async () => {
            // Mock data
            const username = 'admin@google.com';
            const password = 'password';
            const mockError = new Error('Unit Test: Username and password do not match');

            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });

            await expect(db.authenticateUser(username, password)).rejects.toThrow(mockError.message);
        });
    });  

    //Test for checkUsernameExists function
    describe('checkUsernameExists', () => {
        test('should throw an error if username is missing', async () => {
            // Mock data with missing username
            const username = '';
            
            // Call the function and expect it to throw an error
            await expect(db.checkUsernameExists(username)).rejects.toThrow('Username is required.');
        });

        test('should return false if username does not exist', async () => {
            // Mock data with a non-existing username
            const username = 'fakeuser';
            
            // Call the function and expect it to return false
            const exists = await db.checkUsernameExists(username);
            expect(exists).toBe(false);
        });
    });

    //Test for userRegister function
    describe('userRegister', () => {
        test('should throw an error if username is missing', async () => {
            // Mock data with missing username
            const username = '';
            const password = 'password123';
            const first_login = 1;
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow('Username, password, and first_login are required.');
        });
    
        test('should throw an error if password is missing', async () => {
            // Mock data with missing password
            const username = 'user@example.com';
            const password = '';
            const first_login = 1;
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow('Username, password, and first_login are required.');
        });
    
        test('should throw an error if first_login is missing', async () => {
            // Mock data with missing first_login
            const username = 'user@example.com';
            const password = 'password123';
            const first_login = undefined;
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow('Username, password, and first_login are required.');
        });
    
        test('should not throw an error if all required fields are provided', async () => {
            // Mock valid data
            const username = 'user@example.com';
            const password = 'password123';
            const first_login = 1;
        
            // Mock successful database insertion
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate a successful insertion
                    callback(null, { insertId: 1 }); // Mock insertId
                })
            });
        
            // Call the function and expect it to resolve without throwing an error
            await expect(db.userRegister(username, password, first_login)).resolves.toBeDefined();
        });
        
        test('should throw an error if database insertion fails', async () => {
            // Mock data
            const username = 'user123@example.com';
            const password = 'password123';
            const first_login = true;
            const mockError = new Error('User registration failed');
        
            // Mock error during database insertion
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError, null); // Simulate an error with null result
                })
            });
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow(mockError.message);
        });
    });
});