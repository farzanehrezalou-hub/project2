import { PrismaClient } from "@prisma/client";

console.log("DATABASE:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

export default prisma;



// import 'dotenv/config'
// import { defineConfig, env } from 'prisma/config'



// export default defineConfig({
//   schema: 'prisma/schema.prisma',
//   datasource: {
//     url: env('DIRECT_URL'),
//   },
// })



