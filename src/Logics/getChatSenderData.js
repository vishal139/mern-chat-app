const getSenderData = (loggedUser, users) => {

  if (users && loggedUser) {
    return users && users[0]._id === loggedUser._id
      ? users[1]
      : users[0];
  }

  return;
};

export default getSenderData;
