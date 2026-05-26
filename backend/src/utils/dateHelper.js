const getTodayDateString = () => {
  const options = { 
    timeZone: 'Asia/Jakarta', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  };
  
  const formatter = new Intl.DateTimeFormat('fr-CA', options);
  return formatter.format(new Date());
};

module.exports = { getTodayDateString };