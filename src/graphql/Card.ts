import { extendType, nonNull, objectType, stringArg, intArg } from "nexus"; 
import { NexusGenObjects } from "../../nexus-typegen";  

export const Card = objectType({
    name: "Card", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("category"); 
        t.nonNull.string("task"); 
        t.nonNull.string("plan"); 
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

{/*===========Get cards===========*/}
export const cardQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   
            type: "Card",
            resolve(parent, args, context, info) {    
                return context.prisma.card.findMany(); 
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
            
            resolve(parent, args, context) {    
                const { category, task, plan } = args;  
                
                const newCard = context.prisma.card.create({
                    data: {
                        category: category,
                        task: task,
                        plan: plan
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