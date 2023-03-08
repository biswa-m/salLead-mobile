const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
};

export default sleep;
