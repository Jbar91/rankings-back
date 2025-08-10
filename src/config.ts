import dotenv from 'dotenv'
dotenv.config()

export const config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  cluster: process.env.CLUSTER,
  dbName: process.env.NAME,
  jwtsecret: process.env.SECRET,
}
