import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import SearchBar from './components/SearchBar';
import UserCard from './components/UserCard';
import { fetchUsers, loadCachedUsers } from './redux/usersSlice';
import { store } from './redux/store';

function UserListScreen() {
  const dispatch = useDispatch();
  const { items, page, hasMore, status, error } = useSelector((state) => state.users);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      await dispatch(loadCachedUsers());
      if (active) dispatch(fetchUsers({ page: 1 }));
    };

    bootstrap();
    return () => {
      active = false;
    };
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((user) => user.name.toLowerCase().includes(query));
  }, [items, search]);

  const loadMore = useCallback(() => {
    if (status === 'loading' || !hasMore) return;
    dispatch(fetchUsers({ page: page + 1 }));
  }, [dispatch, hasMore, page, status]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(fetchUsers({ page: 1 }));
    setIsRefreshing(false);
  }, [dispatch]);

  const renderItem = useCallback(({ item }) => <UserCard user={item} />, []);
  const keyExtractor = useCallback((item) => String(item.id), []);

  const footer = useMemo(() => {
    if (filteredUsers.length === 0) return null;

    return (
      <View style={styles.footer}>
        {hasMore ? (
          <Pressable
            style={({ pressed }) => [styles.loadMoreButton, pressed && styles.buttonPressed]}
            onPress={loadMore}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </Pressable>
        ) : (
          <Text style={styles.endText}>All users loaded</Text>
        )}
      </View>
    );
  }, [filteredUsers.length, hasMore, loadMore, status]);

  const isInitialLoading = items.length === 0 && status === 'loading';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FEKRA coding test</Text>
          <Text style={styles.title}>User directory</Text>
          <Text style={styles.subtitle}>Search cached users and load more from the API.</Text>
        </View>

        <SearchBar value={search} onChangeText={setSearch} />

        {error && items.length > 0 ? (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>Offline mode — showing cached data.</Text>
          </View>
        ) : null}

        {isInitialLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#111827" />
            <Text style={styles.stateText}>Loading users…</Text>
          </View>
        ) : error && items.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.stateTitle}>Couldn’t load users</Text>
            <Text style={styles.stateText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              <View style={styles.centerState}>
                <Text style={styles.stateTitle}>No matching users</Text>
                <Text style={styles.stateText}>Try a different name.</Text>
              </View>
            }
            ListFooterComponent={footer}
            contentContainerStyle={filteredUsers.length === 0 ? styles.emptyList : styles.listContent}
            refreshing={isRefreshing}
            onRefresh={refresh}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={7}
            removeClippedSubviews
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <UserListScreen />
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  header: {
    marginBottom: 22,
  },
  eyebrow: {
    marginBottom: 8,
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  subtitle: {
    marginTop: 7,
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  offlineBanner: {
    marginBottom: 12,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
  },
  offlineText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 28,
  },
  emptyList: {
    flexGrow: 1,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 220,
    paddingHorizontal: 24,
  },
  stateTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#111827',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadMoreButton: {
    minWidth: 150,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#111827',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  endText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});
