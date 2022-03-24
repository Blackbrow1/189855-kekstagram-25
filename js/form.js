import { isEscapeKey } from './util.js';

const uploadFileField = document.querySelector('#upload-file');
const imgUploadOverlay = document.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const uploadCancelButton = document.querySelector('#upload-cancel');
const form = document.querySelector('.img-upload__form');
const uploadSubmitButton = form.querySelector('.img-upload__submit');
const hashtagsField = form.querySelector('.text__hashtags');
const descriptionField = form.querySelector('.text__description');

const re = /^#[A-Za-zA-Яа-яЁё0-9]{1,19}$/;

const pristine = new Pristine(form, {
  classTo: 'img-upload__error-wrap',
  errorTextParent: 'img-upload__error-wrap',
  errorTextClass: 'text-help'
});

pristine.addValidator(hashtagsField, () => {
  const hashtags = hashtagsField.value.split(' ').filter((item) => item !== '');

  return hashtags.length <= 5;
}, 'Количество хэштегов не больше 5', 1, false);

pristine.addValidator(hashtagsField, () => {
  const hashtags = hashtagsField.value.split(' ').filter((item) => item !== '');

  return hashtags.every((elem) => re.test(elem));
}, 'Начинается с #, не более 20 знаков, только буквы и цифры', 1, false);

pristine.addValidator(hashtagsField, () => {
  const hashtags = hashtagsField.value.split(' ').filter((item) => item !== '');
  const hashtagsLowerCase = hashtags.map((item) => item.toLowerCase());
  const uniqueHashtags = new Set(hashtagsLowerCase);

  return uniqueHashtags.size === hashtags.length;
}, 'Не должно быть одинаковых хэштегов', 1, false);

const getValidateStatus = () => {
  const isValid = pristine.validate();
  if (isValid) {
    uploadSubmitButton.disabled = false;
  } else {
    uploadSubmitButton.disabled = true;
  }
};

const activateFormValidation = () => {
  hashtagsField.addEventListener('input', getValidateStatus);
  descriptionField.addEventListener('input', getValidateStatus);
};

const desactivateFormValidation = () => {
  hashtagsField.removeEventListener('input', getValidateStatus);
  descriptionField.removeEventListener('input', getValidateStatus);
};

const onPopupEscButtonPress = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeEditFormModal();
  }
};

const onUploadCuncelButtonClick = () => {
  closeEditFormModal();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
};

const onTextFieldEscButtonPress = (evt) => {
  evt.stopPropagation();
};

const openEditFormModal = () => {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onPopupEscButtonPress);
  uploadCancelButton.addEventListener('click', onUploadCuncelButtonClick);
  form.addEventListener('submit', onFormSubmit);
  hashtagsField.addEventListener('keydown', onTextFieldEscButtonPress);
  descriptionField.addEventListener('keydown', onTextFieldEscButtonPress);
  activateFormValidation();
};

function closeEditFormModal() {
  imgUploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onPopupEscButtonPress);
  uploadCancelButton.removeEventListener('click', onUploadCuncelButtonClick);
  form.removeEventListener('submit', onFormSubmit);
  hashtagsField.removeEventListener('keydown', onTextFieldEscButtonPress);
  descriptionField.removeEventListener('keydown', onTextFieldEscButtonPress);
  desactivateFormValidation();

  uploadFileField.value = '';
}

const onUploadFileFieldChange = () => {
  openEditFormModal();
};

const activateFileLoader = () => {
  uploadFileField.addEventListener('change', onUploadFileFieldChange);
};

export default activateFileLoader;