const formatPhoneNo = input => {
  if (!input || isNaN(input)) return input;

  if (typeof input !== 'string') input = input.toString();
  if (input.length === 10) {
    return input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    return input;
  }
};

export default formatPhoneNo;
