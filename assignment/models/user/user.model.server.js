module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    // Modifies the data, no matter how it is used.
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByFacebookId: findUserByFacebookId
    };
    return api;
    
    function findUserById(userId) {
        return UserModel.findById(userId);
    }
    
    function findUserByCredentials(username, password) {
      return UserModel.findOne({username: username, password: password});
    }
    
    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }
    
    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});

    }
    function createUser(user) {
        return UserModel.create(user);
    }
    
    function updateUser(userId, user) {
        return UserModel
            .update(
                {
                    _id : userId
                },
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            );
    }

    function deleteUser(userId) {
        return UserModel
            .remove({
                _id: userId
            });
    }
};