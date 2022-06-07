// 1
import { PrismaClient } from "@prisma/client";
import { Card } from "./graphql";

// 2
const prisma = new PrismaClient();

// 3
async function main() {
    const newCard = await prisma.card.create({
        data: {
            category: "tech",
            task: "Learn web3 fundamentals",
            plan: "Today - at 6am"
        },
      })
    const allCards = await prisma.card.findMany();
    console.log(allCards);
}

// 4
main()
    .catch((e) => {
        throw e;
    })
    // 5
    .finally(async () => {
        await prisma.$disconnect();
    });