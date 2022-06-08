import { extendType, nonNull, objectType, stringArg, intArg, idArg } from "nexus";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("cards", {    
            type: "Card",
            resolve(parent, args, context) {   
                return context.prisma.user 
                    .findUnique({ where: { id: parent.id } })
                    .cards();
            },
        }); 
    },
});

export const UserQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("userFeed", {   
            type: "User",
            resolve(parent, args, context, info) {    
                return context.prisma.user.findMany();  
            },
        });
    },
});

{/*===========Update card===========*/}
export const updateUserQuery = extendType({  
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateUser", {   
            type: "User",
            args: {   
                id: nonNull(intArg()),
                name: nonNull(stringArg()),
                email: nonNull(stringArg()),
            },
            resolve(parent, args, context, info) {    
                const { id, name, email } = args; 
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot update user without logging in.");
                }

                const updateUser = context.prisma.user.update({
                    where: {
                      id: id,
                    },
                    data: {
                    name,
                    email
                    },
                  })
                return updateUser

            },
        });
    },
});

{/*===========Delete card===========*/}
export const deleteUserQuery = extendType({ 
    type: "Mutation",
    definition(t) {
        t.nonNull.field("deleteUser", {   
            type: "User",
            args: {   
                id: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {    
                const { id } = args; 
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot delete user without logging in.");
                }

                const deleteUser = context.prisma.user.delete({
                    where: {
                      id: id,
                    },
                  })
                  return deleteUser
            },
        });
    },
});