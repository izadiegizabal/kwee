class UsersList {
    constructor() {
        this.list = [];
     }

    add( user ) {
        this.list.push( user );
        console.log( this.list );
        return user;
    }

    updateEmail( id, email ) {
        this.list.forEach(user => {
            if ( user.id === id ){
                user.email = email;
            }
        });
        console.log( this.list );
    }

    getList() {
        return this.list;
    }

    getUser( id ) {
        return this.list.find( user => user.id === id );
    }

    deleteUser( id ) {
        const tempUser = this.getUser( id );
        
        this.list = this.list.filter( user => user.id !==id );
        console.log( this.list );
        return tempUser;
    }

}

// let usersConnected = new UsersList();

module.exports = UsersList;