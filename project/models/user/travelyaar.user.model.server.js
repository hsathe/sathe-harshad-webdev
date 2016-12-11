module.exports = function () {
    var mongoose = require("mongoose");
    var TravelYaarUserSchema = require("./travelyaar.user.schema.server")();
    var travelyaarUserModel = mongoose.model("travelyaarUserModel", TravelYaarUserSchema);

    var api = {
        createUser: createUser,
        findUserByEmail: findUserByEmail,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGoogleId: findUserByGoogleId,
        findAllUsers: findAllUsers,
        findUsersToFollow: findUsersToFollow,
        findFollowersForUser: findFollowersForUser,
        findFollowingForUser: findFollowingForUser,
        addFollower: addFollower,
        removeFollowing: removeFollowing,
        addFollowing: addFollowing,
        removeFollower: removeFollower,
        removeUserFromFollowing: removeUserFromFollowing,
        removeUserFromAllFollowers:removeUserFromAllFollowers,
        addRecommendation: addRecommendation,
        removeRecommendation: removeRecommendation,
        updateUser: updateUser,
        deleteUser: deleteUser
    };

    return api;

    function createUser(user) {
        console.log("Creating user" + user);
        return travelyaarUserModel.create(user);
    }

    function findUserByEmail(email) {
        console.log("Find User by Email" + email);
        return travelyaarUserModel.findOne({email: email});
    }

    function findUserById(userId) {
        console.log("Find ");
        return travelyaarUserModel.findById(userId);
    }

    function findUserByCredentials(email, password) {
        return travelyaarUserModel.findOne({email: email, password: password});
    }
    
    function findUserByFacebookId(facebookId) {
        return ProjectUser.findOne({'facebook.id': facebookId});
    }

    function findUserByGoogleId(googleId) {
        return ProjectUser.findOne({'google.id': googleId});
    }
    function findAllUsers() {
        return travelyaarUserModel.find();
    }

    // $nin: is not in - Find all users not
    function findUsersToFollow(user) {
        return travelyaarUserModel.find({_id: {$nin: user.following}});
    }

    function findFollowersForUser(user) {
        return travelyaarUserModel.find({_id: {$in: user.followers}});
    }

    function findFollowingForUser(user) {
        return travelyaarUserModel.find({_id: {$in: user.following}});
    }

    function addFollower(followerId, userId) {
        return travelyaarUserModel.update({_id: userId}, {
            $push: {followers: followerId}
        });
    }

    function removeFollower(followerId, userId) {
        return travelyaarUserModel.update({_id: userId}, {
            $pull: {followers: followerId}
        });

    }

    function addFollowing(followingId, userId) {
        return travelyaarUserModel.update({_id: userId},{
            $push: {following:followingId}
        });
    }

    function removeFollowing(followingId, userId) {
        return travelyaarUserModel.update({_id: userId},{
            $pull: {following:followingId}
        });
    }

    function removeUserFromFollowing(user) {
        return travelyaarUserModel
            .update(
                {_id: {$in: user.following}},
                {$pull: {followers:user._id}},
                {multi:true}
            );
    }
    
    function removeUserFromAllFollowers(user) {
        return travelyaarUserModel
            .update(
                {_id:{$in: user.followers}},
                {$pull: {following: user._id}},
                {multi: true}
            );
    }

    function addRecommendation(placeId, userId) {
        return travelyaarUserModel
            .update(
                {_id: userId},{
                    $push: {recommendations: placeId}
                });
    }
    
    function removeRecommendation(placeId, userId) {
        return travelyaarUserModel
            .update({_id: userId},{
                $pull: {recommendations: placeId}
            });
    }
    function updateUser(userId, user) {
        delete user._id;
        return travelyaarUserModel
            .update({_id: userId}, {
                $set: {
                    password: user.password,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
    }

    function deleteUser(userId) {
        return travelyaarUserModel.remove({_id: userId});
    }
};