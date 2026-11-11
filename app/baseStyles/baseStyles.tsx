import { StyleSheet } from 'react-native'; // Hello from front
import colors from './colors';

const commonStyles = StyleSheet.create({
  card: {
    width: 'auto',
    height: 'auto',
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: colors.surface.card,
    padding: 24,
    // iOS
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android
    elevation: 4,
  },
  title: {
    color: colors.brand.dark,
    fontFamily: 'Nunito-Bold',
    fontSize: 36,
    fontStyle: 'normal',
  },
  header: {
    color: colors.brand.dark,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    fontStyle: 'normal',
  },
  paragraph: {
    color: colors.text.secondary,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
  },
  paragraphRegular: {
    color: colors.text.secondary,
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    fontStyle: 'normal',
  },
  paragraphItalic: {
    color: colors.text.secondary,
    fontFamily: 'OpenSans-SemiBoldItalic',
    fontSize: 14,
    fontStyle: 'normal',
  },
  paragraphBold: {
    color: colors.text.secondary,
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    fontStyle: 'normal',
  },
  paragraphExtraBold: {
    color: colors.brand.dark,
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 14,
    fontStyle: 'normal',
  },
  container: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android
    elevation: 4,
  },
  buttonNoShadow: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.neutral,
    color: colors.text.secondary,
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    fontStyle: 'normal',
  },
});

export default commonStyles;
