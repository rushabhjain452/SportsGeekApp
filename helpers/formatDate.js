const formatDate = (dateStr) => {
// const formatDate = (str) => {
  // let day = str.substring(8,10);
  // let mth = str.substring(5,7);
  // let yr = str.substring(0,4);
  // let hr = str.substring(11,13);
  // let min = str.substring(14,16);
  // let ampm;
  // if(hr < 12){
  //   ampm = 'AM';
  // }
  // else{
  //   ampm = 'PM';
  //   hr -= 12;
  // }

  // For localhost
  // console.log('Passed date : ' + dateStr);
  let dt = new Date(dateStr);
  let str = dt.toString();
  // console.log(str);
  // Wed May 26 2021 19:30:00 GMT+0530 (IST)
  let day = str.substring(8,10);
  let mth = str.substring(4,7);
  let yr = str.substring(11,15);
  let hr = str.substring(16,18);
  let min = str.substring(19,21);
  let ampm;
  if(hr < 12){
    ampm = 'AM';
  }
  else{
    ampm = 'PM';
    hr -= 12;
  }
    
  return day + '-' + mth + '-' + yr + '  ' + hr + ':' + min + ' ' + ampm;

  // let current_timestamp = new Date();
  // console.log(current_timestamp < str);

  // console.log('--------------------------------------------');
  // console.log('Current date : ' + current_timestamp.toString());
  // console.log('Current milliseconds : ' + current_timestamp.getMilliseconds());
  // console.log('Original Date : ' + str);
  // let dt = new Date(str);
  // let dt2 = new Date(dt.toISOString());
  // console.log('Formatted date : ' + dt2.toString());
  // console.log('Match milliseconds : ' + dt2.getMilliseconds());

  // For Heroku
  // 2021-04-05T15:30:00.000+00:00
  // let day = str.substring(8,10);
  // let mth = str.substring(5,7);
  // let yr = str.substring(0,4);
  // let hr = str.substring(11,13);
  // let min = str.substring(14,16);
  // let ampm;
  // if(hr < 12){
  //   ampm = 'AM';
  // }
  // else{
  //   ampm = 'PM';
  //   hr -= 12;
  // }
    
  // return day + '-' + mth + '-' + yr + '  ' + hr + ':' + min + ' ' + ampm;
}

export default formatDate;