import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let adminDbConnection;

const connectAdminDb = async () => {
    try {
        if (!adminDbConnection) {
          const  ADMIN_DB_URI="mongodb+srv://admin:admin@cluster0.elx77.mongodb.net/adminDB?retryWrites=true&w=majority"
            
            // Use mongoose.createConnection to establish a new connection
            adminDbConnection = mongoose.createConnection(ADMIN_DB_URI);

            adminDbConnection.on('connected', () => {
                console.log('Admin database connected successfully');
            });

            adminDbConnection.on('error', (error) => {
                console.error('Admin database connection error:', error);
            });
        }

        return adminDbConnection;
    } catch (error) {
        console.error('Error during Admin database connection:', error);
        throw error;
    }
};

export default connectAdminDb;
