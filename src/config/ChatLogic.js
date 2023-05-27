export const getSenderName = (currentUser, allIds) => {
  return allIds?.filter((user) => user._id !== currentUser._id)[0].name;
};

export const getSenderFullDetails = (currentUser, allIds) => {
  return allIds?.filter((user) => user._id !== currentUser._id)[0];
};

export const isSameSender = (messages, index) => {
  return (
    messages[index - 1] !== undefined &&
    messages[index].sender._id === messages[index - 1].sender._id
  );
};
