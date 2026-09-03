import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function UserCard({ user }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name?.slice(0, 1)?.toUpperCase() || '?'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
        <Text style={styles.address}>{user.address}</Text>
      </View>
    </View>
  );
}

export default memo(UserCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#111827',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  name: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  email: {
    marginTop: 3,
    color: '#4B5563',
    fontSize: 13,
  },
  address: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
  },
});
