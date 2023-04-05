function changePasswordAfter(passwordChangeAt, iat) {
  const createdTime = passwordChangeAt.getTime() / 1000;
  // console.log(createdTime, "   ", iat);
  return iat < createdTime;
}

module.exports={
    changePasswordAfter
}