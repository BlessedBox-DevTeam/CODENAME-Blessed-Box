import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
    card: {
        width: 'auto',
        height: 'auto',
        flexShrink: 0,
        borderRadius:10,
        backgroundColor: colors.white,
        padding:24,
        // iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // Android
        elevation: 4
  },
    title: {
        color: colors.dark_green,
        fontFamily:'Playfair Display',
        fontSize:36,
        fontStyle:'normal',
        fontWeight:'900',
        lineHeight: 16 * 1.4
},
    header:{
        color:colors.dark_blue,
        fontFamily:'open-sans',
        fontSize:28,
        fontStyle:'normal',
        fontWeight:700,
        lineHeight: 16 * 1.4
    },
    paragraph:{
        color:colors.dark_gray,
        fontFamily:'open-sans',
        fontSize:26,
        fontStyle:'normal',
        fontWeight:600,
        lineHeight: 16 * 1.4
},
    paragraphBold:{
        color:colors.dark_gray,
        fontFamily:'open-sans',
        fontSize:26,
        fontStyle:'normal',
        fontWeight:700,
        lineHeight: 16 * 1.4
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
    gridContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        columnGap: 16, 
        marginTop: 20,
},
    leftColumn: {
        flex: 1,
        justifyContent: 'flex-start',
        rowGap:16,
},
    rightColumn: {
        justifyContent: 'center',
        alignItems: 'center',
},
});
