const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()

module.exports = {

    post: async (req, res) => {
        const { username, email, password, mobile } = req.body
        try {
                // //validate user input
                if (!(username && email && password)) {
                   return res.status(400).send({ message:"Input is invalid"})
                }

                // //Check user in database
                const existUser = await prisma.users.findUnique({
                    where: {
                        username: username
                    }
                })

                if (existUser) {
                   return res.status(400).send({ message: "User already exist"})
                }
                //hash password and create user
                const hashPassword = await bcrypt.hash(password, 10)
                const user = await prisma.users.create({
                    data: {
                        username: username,
                        email: email,
                        password: hashPassword,
                        moblie: mobile
                    }
                })

                //Create Token
                const token = jwt.sign(
                    { user_id: user._id, username },
                    process.env.TOKEN_KEY,
                    { expiresIn: "1h"}
                )

                //Save user token
                user.token = token

                res.json(user)

            }
            
            catch (err) {
                res.status(500).send({message : "registers failed",})
            }
           
}

}