import dotenv from 'dotenv';

dotenv.config();

const generateToken = (userId,res)=> {
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' });
        console.log('Generated Token:', token);

        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 86400000, 
            sameSite: 'Strict',
        });

}

export default generateToken;