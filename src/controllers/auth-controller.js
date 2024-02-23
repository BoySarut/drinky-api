const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

module.exports = {
    post: async (req, res, next) => {
        const { username, password } = req.body
        try {
        const user = await prisma.users.findUnique({
            where: {
                username: username
            }
        })
        if (!user) return res.status(404).send({ error: 'User not found' })

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                { expiresIn: "1h"}
            )
            user.token = token
            res.status(200).json(user)
        } else res.status(400).send({ message: 'Invalid password' })
    }
    catch (err) {
        res.status(500).send({message : "Login failed",})
    }
}
}