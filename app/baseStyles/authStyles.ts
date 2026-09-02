import { StyleSheet } from 'react-native';

export const authColors = {
  background: '#FFF8F1',
  header: '#F3B080',
  input: '#FBEEDF',
  text: '#261810',
  mutedText: '#96745C',
  inputText: '#5E483A',
  placeholder: '#A18E82',
  primary: '#D95727',
  white: '#FFFFFF',
};

export const authStyles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#F3B080',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 116,
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: authColors.white,
    shadowColor: '#8E4D2D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  loadingBrand: {
    marginTop: 18,
    fontSize: 32,
    fontWeight: '900',
    color: authColors.text,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  loadingShape: {
    position: 'absolute',
    borderRadius: 999,
  },
  loadingShapeLarge: {
    width: 300,
    height: 300,
    top: -110,
    right: -90,
    backgroundColor: 'rgba(203,83,38,0.16)',
  },
  loadingShapeSmall: {
    width: 190,
    height: 190,
    bottom: -65,
    left: -55,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  screen: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  form: {
    flex: 1,
    paddingBottom: 8,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
    color: authColors.mutedText,
  },
  input: {
    width: '100%',
    backgroundColor: authColors.input,
    color: authColors.inputText,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authColors.input,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: authColors.inputText,
    paddingVertical: 0,
    paddingRight: 5,
  },
  passwordToggle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontWeight: '800',
    color: authColors.primary,
  },
  submitButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: authColors.primary,
    shadowColor: authColors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  submitText: {
    fontWeight: '800',
    color: authColors.white,
  },
  submitArrow: {
    color: authColors.white,
    marginLeft: 9,
    marginTop: -2,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  registerText: {
    color: authColors.mutedText,
  },
  registerAction: {
    fontWeight: '900',
    color: authColors.primary,
  },
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: 'rgba(38, 24, 16, 0.25)',
  },
  modalContent: {
    width: '100%',
    padding: 25,
    borderRadius: 25,
    backgroundColor: authColors.background,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: authColors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    color: authColors.mutedText,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: authColors.primary,
  },
  modalButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: authColors.white,
  },
  registerScreen: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  registerHeader: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 22,
    backgroundColor: authColors.primary,
  },
  registerHeaderCompact: {
    paddingTop: 14,
    paddingBottom: 16,
  },
  registerHeaderVeryCompact: {
    paddingTop: 10,
    paddingBottom: 12,
  },
  registerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  registerBrandCompact: {
    marginBottom: 10,
  },
  registerLogo: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#EE9568',
  },
  registerLogoCompact: {
    width: 52,
    height: 52,
    borderRadius: 17,
  },
  registerBrandName: {
    marginLeft: 15,
    fontSize: 25,
    fontWeight: '900',
    color: authColors.white,
  },
  registerBrandNameCompact: {
    marginLeft: 11,
    fontSize: 21,
  },
  registerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: authColors.white,
  },
  registerTitleCompact: {
    fontSize: 26,
  },
  registerSubtitle: {
    marginTop: 6,
    fontSize: 16,
    color: authColors.white,
  },
  registerSubtitleCompact: {
    marginTop: 3,
    fontSize: 14,
  },
  benefits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 16,
    backgroundColor: '#FBE9D8',
  },
  benefitsCompact: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  benefit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  benefitCompact: {
    paddingHorizontal: 2,
  },
  benefitCheck: {
    marginRight: 7,
    fontSize: 18,
    color: authColors.primary,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    color: authColors.mutedText,
  },
  benefitTextCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
  registerForm: {
    paddingHorizontal: 30,
    paddingTop: 26,
    paddingBottom: 30,
  },
  registerField: {
    marginBottom: 20,
  },
  registerFieldCompact: {
    marginBottom: 12,
  },
  registerInput: {
    minHeight: 66,
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 20,
    backgroundColor: authColors.input,
  },
  registerPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 66,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 14,
    borderRadius: 25,
    backgroundColor: authColors.input,
  },
  registerPasswordInput: {
    flex: 1,
    fontSize: 20,
    color: authColors.inputText,
  },
  registerTerms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    marginBottom: 25,
  },
  registerTermsCompact: {
    marginBottom: 16,
  },
  termsBox: {
    width: 28,
    height: 28,
    marginRight: 14,
    borderWidth: 3,
    borderColor: '#D9CFC6',
    borderRadius: 5,
  },
  termsBoxChecked: {
    borderColor: authColors.primary,
    backgroundColor: authColors.primary,
  },
  termsCheck: {
    fontSize: 18,
    fontWeight: '700',
    color: authColors.white,
  },
  termsText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    color: authColors.mutedText,
  },
  termsLink: {
    color: authColors.primary,
  },
  registerButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#F4EADF',
  },
  registerButtonCompact: {
    minHeight: 46,
    borderRadius: 16,
  },
  registerButtonActive: {
    backgroundColor: authColors.primary,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#C7A995',
  },
  registerButtonTextActive: {
    color: authColors.white,
  },
  registerButtonArrow: {
    marginLeft: 10,
    fontSize: 22,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  loginPromptCompact: {
    marginTop: 12,
  },
  loginPromptText: {
    color: authColors.mutedText,
  },
  loginPromptAction: {
    fontWeight: '900',
    color: authColors.primary,
  },
});
