module.exports = function () {
    var mongoose = require("mongoose");
    var TravelYaarUserSchema = require("./travelyaar.user.schema.server")();
    var travelyaarUserModel = mongoose.model("travelyaarUserModel", TravelYaarUserSchema);

    var api = {
        createUser: createUser,
        findUserByEmail: findUserByEmail,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findAllUsers: findAllUsers,
        findUsersToFollow: findUsersToFollow,
        findFollowersForUser: findFollowersForUser,
        findFollowingForUser: findFollowingForUser,
        addFollower: addFollower,
        removeFollowing: removeFollowing,
        addFollowing: addFollowing,
        removeFollower: removeFollower,
        removeUserFromFollowing: removeUserFromFollowing,
        removeUserFromAllFollowers:removeUserFromAllFollowers
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
};