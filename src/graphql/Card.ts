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
        t.nonNull.list.nonNull.field("feed", {   // 3
            type: "Card",
            resolve(parent, args, context, info) {    // 4
                return cards;
            },
        });
    },
});

{/*===========Get single card===========*/}
export const singleLinkQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("card", {   // 3
            type: "Card",
            args: {   // 3
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    // 4
                const { id } = args; 
                let card = cards.filter(l => l.id === id)
                    return card
            },
        });
    },
});

{/*===========Create cards===========*/}
export const LinkMutation = extendType({  // 1
    type: "Mutation",    
    definition(t) {
        t.nonNull.field("post", {  // 2
            type: "Card",  
            args: {   // 3
                category: nonNull(stringArg()),
                task: nonNull(stringArg()),
                plan: nonNull(stringArg())
            },
            
            resolve(parent, args, context) {    
                const { category, task, plan } = args;  // 4
                
                let idCount = cards.length + 1;  // 5
                const card = {
                    id: idCount,
                    category: category,
                    task: task,
                    plan: plan
                };
                cards.push(card);
                return card;
            },
        });
    },
});

{/*===========Update card===========*/}
export const updateLinkQuery = extendType({  // 2
    type: "Mutation",
    definition(t) {
        t.nonNull.list.nonNull.field("updateCard", {   // 3
            type: "Card",
            args: {   // 3
                id: nonNull(intArg()),
                category: nonNull(stringArg()),
                task: nonNull(stringArg()),
                plan: nonNull(stringArg()),
            },
            resolve(parent, args, context, info) {    // 4
                const { id, category, task, plan } = args; 

                let updatedCards = cards.filter(c => c.id == id)
                updatedCards[0].category = category
                updatedCards[0].task = task
                updatedCards[0].plan = plan

                cards = updatedCards
                return cards;

            },
        });
    },
});

{/*===========Delete card===========*/}
export const deleteLinkQuery = extendType({  // 2
    type: "Mutation",
    definition(t) {
        t.nonNull.list.nonNull.field("deleteCard", {   // 3
            type: "Card",
            args: {   // 3
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    // 4
                const { id } = args; 
                let updatedCards = cards.filter(c => c.id !== id)
                cards = updatedCards
                return cards;
            },
        });
    },
});