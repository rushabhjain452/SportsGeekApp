import SweetAlert from 'react-native-sweet-alert';

const showSweetAlert = (status, title, msg) => {
  SweetAlert.showAlertWithOptions({
    title: title,
    subTitle: msg,
    confirmButtonTitle: 'OK',
    confirmButtonColor: '#000',
    style: status,
    cancellable: true
  });
}

export default showSweetAlert;