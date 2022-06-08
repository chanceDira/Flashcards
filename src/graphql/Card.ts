import { extendType, nonNull, objectType, stringArg, intArg, inputObjectType, enumType, arg, list } from "nexus";
import { Prisma } from "@prisma/client"
import { NexusGenObjects } from "../../nexus-typegen";  

export const Card = objectType({
    name: "Card", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("category"); 
        t.nonNull.string("task"); 
        t.nonNull.string("plan"); 
        t.field("createdBy", {   // 1
            type: "User",
            resolve(parent, args, context) {  // 2
                return context.prisma.card
                    .findUnique({ where: { id: parent.id } })
                    .createdBy();
            },
        });
    },
});

let cards: NexusGenObjects["Card"][]= [   
    {
        id: 1,
        category: "tech",
        task: "Learn typescript",
        plan: "Today - 3 hours"
    },
    {
        id: 2,
        category: "family",
        task: "Take my kid to the hospital",
        plan: "Sunday - at 9am"
    },
];

export const CardOrderByInput = inputObjectType({
    name: "CardOrderByInput",
    definition(t) {
        t.field("category", { type: Sort });
        t.field("task", { type: Sort });
        t.field("plan", { type: Sort });
        t.field("createdAt", { type: Sort });
    },
});

export const Sort = enumType({
    name: "Sort",
    members: ["asc", "desc"],
});

{/*===========Get cards===========*/}
export const cardQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   
            type: "Card",
            args: {
                filter: stringArg(),   
                skip: intArg(),   
                take: intArg(), 
                orderBy: arg({ type: list(nonNull(CardOrderByInput)) }),
            },
            resolve(parent, args, context, info) {    
                const where = args.filter   
                    ? {
                          OR: [
                              { category: { contains: args.filter } },
                              { task: { contains: args.filter } },
                              { plan: { contains: args.filter } }
                          ],
                      }
                    : {};
                return context.prisma.card.findMany({
                    where,
                    skip: args?.skip as number | undefined,    
                    take: args?.take as number | undefined,
                    orderBy: args?.orderBy as Prisma.Enumerable<Prisma.CardOrderByWithRelationInput> | undefined,
                });
            },
        });
    },
});

{/*===========Get single card===========*/}
export const singleCardQuery = extendType({ 
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("card", {   
            type: "Card",
            args: {  
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {   
                const { id } = args;
                const singleCard = context.prisma.card.findMany({
                    where: {
                      id: {
                        equals: id
                      }
                    },
                  })
                return singleCard
            },
        });
    },
});

{/*===========Create cards===========*/}
export const CardMutation = extendType({  
    type: "Mutation",    
    definition(t) {
        t.nonNull.field("post", {  
            type: "Card",  
            args: {   
                category: nonNull(stringArg()),
                task: nonNull(stringArg()),
                plan: nonNull(stringArg())
            },
            
            async resolve(parent, args, context) {    
                const { category, task, plan } = args;  
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot post without logging in.");
                }
                
                const newCard = context.prisma.card.create({
                    data: {
                        category,
                        task,
                        plan,
                        createdBy: { connect: { id: userId } },
                       },
                });

                return newCard;
            },
        });
    },
});

{/*===========Update card===========*/}
export const updateCardQuery = extendType({  
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateCard", {   
            type: "Card",
            args: {   
                id: nonNull(intArg()),
                category: nonNull(stringArg()),
                task: nonNull(stringArg()),
                plan: nonNull(stringArg()),
            },
            resolve(parent, args, context, info) {    
                const { id, category, task, plan } = args; 
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot update card without logging in.");
                }

                const updateCard = context.prisma.card.update({
                    where: {
                      id: id,
                    },
                    data: {
                     category: category,
                     task: task,
                     plan: plan
                    },
                  })
                return updateCard

            },
        });
    },
});

{/*===========Delete card===========*/}
export const deleteCardQuery = extendType({ 
    type: "Mutation",
    definition(t) {
        t.nonNull.field("deleteCard", {   
            type: "Card",
            args: {   
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    
                const { id } = args; 
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot delete card without logging in.");
                }

                const deleteCard = context.prisma.card.delete({
                    where: {
                      id: id,
                    },
                  })
                  return deleteCard
            },
        });
    },
});