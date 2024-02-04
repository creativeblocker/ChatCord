// Array to store connected users
const users = [];

// Join a user to the chat
function userjoin(id, username, room) {

    // Create a user object with id, username, and room
    const user = { id, username, room };

    // Add the user to the users array
    users.push(user);

    // Return the user object
    return user;
}

// Get the current user by id
function getcurrentuser(id) {
    // Find and return the user with the specified id
    return users.find(user => user.id === id);
}

// User leaves the chat
function userLeave(id) {
    // Find the index of the user with the specified id
    const index = users.findIndex(user => user.id === id);

    // Remove the user from the array and return the removed user
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get users in a specific room
function getRoom(room) {
    // Filter users based on the specified room and return the result
    return users.filter(user => user.room === room);
}

// Export the functions to be used in other files
module.exports = {
    userjoin,
    getcurrentuser,
    userLeave,
    getRoom
};
