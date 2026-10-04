import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';
import FilterChip from './FilterChip';
import BackArrow from './icons/BackArrow';

export type StatusCode = 'PENDING' | 'COMPLETED' | 'DECLINED';
export type StatusFilter = 'ALL' | StatusCode;

interface TransactionFiltersModalProps {
  visible: boolean;
  selectedStatus: StatusFilter | null;
  onStatusChange: (status: StatusFilter) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
}

const statuses: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'DECLINED' },
];

export default function TransactionFiltersModal({
  visible,
  selectedStatus,
  onStatusChange,
  onClose,
  onReset,
  onApply,
}: TransactionFiltersModalProps) {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <BackArrow onPress={onClose} />
            <View style={styles.headerTitle}>
              <Text style={commonStyles.header}>Filters</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.mainContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Country</Text>
              <Text style={styles.detailValue}>Puerto Rico</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>RC</Text>
              <Text style={styles.detailValue}>Iglesia Cristiana Bethlehem</Text>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.sectionLabel}>Filter by Status</Text>
              <View style={styles.statusRow}>
                {statuses.map((item) => (
                  <FilterChip
                    key={item.label}
                    label={item.label}
                    onPress={() => onStatusChange(item.value)}
                    selected={selectedStatus === item.value}
                    chipStyle={item.value === 'ALL' ? styles.allStatusChip : styles.statusChip}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'transparent']}
            style={styles.buttonShadow}
          />
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 25,
  },
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: colors.dark_gray,
  },
  detailLabel: {
    ...commonStyles.paragraphBold,
    color: colors.dark_blue,
  },
  detailValue: {
    ...commonStyles.paragraph,
    fontSize: 12,
  },
  sectionLabel: {
    ...commonStyles.paragraph,
    fontSize: 12,
  },
  statusContainer: {
    gap: 16,
    width: '100%',
    paddingVertical: 4,
  },
  statusRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  allStatusChip: {
    flex: 0,
    width: 48,
  },
  statusChip: {
    minWidth: 0,
  },
  buttonsContainer: {
    width: '100%',
    position: 'relative',
  },
  buttonShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    zIndex: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 20,
    width: '100%',
    gap: 12,
  },
  resetButton: {
    ...commonStyles.buttonNoShadow,
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.dark_blue,
  },
  applyButton: {
    ...commonStyles.buttonNoShadow,
    flex: 1,
    backgroundColor: colors.dark_blue,
  },
  resetButtonText: {
    ...commonStyles.header,
    color: colors.dark_blue,
  },
  applyButtonText: {
    ...commonStyles.header,
    color: colors.white,
  },
});
