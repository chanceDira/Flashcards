import { extendType, nonNull, objectType, stringArg } from "nexus"; 
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

export const LinkQuery = extendType({  // 2
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