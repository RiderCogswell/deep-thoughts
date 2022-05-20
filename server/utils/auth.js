const jwt = require('jsonwebtoken');

// secrets are incredibly important, so you should store it in another environment variable
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    authMiddleware: function({ req }) {
        // allows token to be sent via the req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // separate "bearer" from the <tokenvalue>
        if (req.headers.authorization) {
            token = token
                .split(' ')
                .pop()
                .trim()
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        // we use a try... catch statement to mute the error
        try {
            // decode and attach user data to request object
            // if the secret on the jwt.verify doesnt match the secret on the jwt.sign, the object wont be decoded and will throw an error
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        // return updated request object
        return req;
    }, 
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
    },
}