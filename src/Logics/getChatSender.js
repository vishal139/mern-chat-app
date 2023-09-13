const getSender = (loggedUser, users) => {

  if (users && loggedUser) {
    return users && users[0]._id === loggedUser._id
      ? users[1].name
      : users[0].name;
  }

  return;
};

export default getSender;
