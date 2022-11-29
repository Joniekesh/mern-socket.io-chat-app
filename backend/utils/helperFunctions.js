let onlineUsers = [];
let rooms = [{}];

const addUser = (_id, socketId, fullName, img, userName) => {
	const foundUser = onlineUsers.find((user) => user._id === _id);

	if (!foundUser) {
		onlineUsers.push({ _id, socketId, fullName, img, userName });
	}
};

const removeUser = (socketId) => {
	onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (_id) => {
	return onlineUsers.find((user) => user._id === _id);
};

const getOnlineUsers = () => {
	let users = [];
	return (users = onlineUsers);
};

const joinRoom = (_id, room) => {
	const foundRoom = rooms.find((r) => r._id === room._id);
	if (!foundRoom.members.includes({ _id })) {
		foundRoom.members.push({ _id });
	}

	rooms.push(foundRoom);
};

const getRoom = (_id) => {
	return rooms.find((room) => room._id === _id);
};

export { addUser, removeUser, getUser, getOnlineUsers, joinRoom, getRoom };
