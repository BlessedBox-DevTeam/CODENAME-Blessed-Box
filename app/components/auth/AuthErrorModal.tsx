import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { authStyles } from '../../baseStyles/authStyles';

type AuthErrorModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AuthErrorModal({ visible, onClose }: AuthErrorModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={authStyles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={authStyles.modalContent}>
              <Text style={authStyles.modalTitle}>Something went wrong</Text>
              <Text style={authStyles.modalMessage}>
                Please verify your email and password and try again.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onClose}
                style={authStyles.modalButton}>
                <Text style={authStyles.modalButtonText}>I understand</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
