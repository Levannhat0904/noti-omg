# [object Object] Background Fetch

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         EXPO APP                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              app/_layout.tsx (ROOT)                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ useEffect(() => {                                 │  │  │
│  │  │   backgroundFetchService.registerBackgroundFetch()│  │  │
│  │  │ }, [])                                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         backgroundFetchService.ts (SERVICE)             │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ registerBackgroundFetch(interval)                 │  │  │
│  │  │ unregisterBackgroundFetch()                       │  │  │
│  │  │ isBackgroundFetchRegistered()                     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │    TaskManager.defineTask() - BACKGROUND TASK           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Task: background-fetch-miners                     │  │  │
│  │  │ Interval: 900s (15 phút)                          │  │  │
│  │  │ stopOnTerminate: false                            │  │  │
│  │  │ startOnBoot: true                                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         app/(tabs)/index.tsx (UI SCREEN)               │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ - Foreground fetch (10s interval)                 │  │  │
│  │  │ - Display status & data                           │  │  │
│  │  │ - Manual refresh button                           │  │  │
│  │  │ - Background fetch info                           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │     MinerService (EXISTING)           │
        │  ┌─────────────────────────────────┐  │
        │  │ - fetchMiners()                 │  │
        │  │ - getStoredMiners()             │  │
        │  │ - compareMiners()               │  │
        │  │ - saveMiners()                  │  │
        │  │ - notifyNewMiners()             │  │
        │  │ - notifyUpdatedMiners()         │  │
        │  │ - notifyRemovedMiners()         │  │
        │  └─────────────────────────────────┘  │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │      External Services                │
        │  ┌─────────────────────────────────┐  │
        │  │ - API Server (fetch data)       │  │
        │  │ - AsyncStorage (local storage)  │  │
        │  │ - Notifications (send alerts)   │  │
        │  └─────────────────────────────────┘  │
        └───────────────────────────────────────┘
```

---

## Data Flow

### Foreground Flow (App Mở)

```
┌─────────────┐
│  App Mở     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ useMinerFetcher Hook     │
│ (10s interval)           │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ MinerService.fetchMiners()
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ API Call                 │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Compare Data             │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Send Notifications       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Save to Storage          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Update UI                │
└──────────────────────────┘
```

### Background Flow (App Ở Background)

```
┌─────────────────────────┐
│  App Ở Background       │
│  (hoặc Terminated)      │
└──────┬──────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Background Fetch Task    │
│ (15 phút interval)       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ MinerService.fetchMiners()
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ API Call                 │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Compare Data             │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Send Notifications       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Save to Storage          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Return Result            │
│ (No UI Update)           │
└──────────────────────────┘
```

---

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                    App Lifecycle                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  App Start                                                  │
│    │                                                        │
│    ├─► app/_layout.tsx                                     │
│    │   └─► registerBackgroundFetch(900)                    │
│    │       └─► TaskManager.defineTask()                    │
│    │           └─► Background task registered              │
│    │                                                        │
│    └─► app/(tabs)/index.tsx                                │
│        └─► useMinerFetcher()                               │
│            └─► startFetching() [10s interval]              │
│                                                             │
│  App Running                                                │
│    │                                                        │
│    ├─► Foreground: Fetch mỗi 10s                           │
│    │                                                        │
│    └─► Background: Fetch mỗi 15 phút (parallel)            │
│                                                             │
│  App Closed                                                 │
│    │                                                        │
│    └─► Background Task: Fetch mỗi 15 phút                  │
│        (stopOnTerminate: false)                             │
│                                                             │
│  Device Reboot                                              │
│    │                                                        │
│    └─► Background Task: Tự động start                      │
│        (startOnBoot: true)                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management

```
┌──────────────────────────────────────────────────────────┐
│              useMinerFetcher State                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  miners: MinerData[]                                     │
│  ├─ Updated by: foreground fetch (10s)                  │
│  └─ Updated by: manual refresh                          │
│                                                          │
│  loading: boolean                                        │
│  ├─ true: during fetch                                  │
│  └─ false: fetch complete                               │
│                                                          │
│  error: string | null                                   │
│  ├─ Set on: fetch error                                 │
│  └─ Cleared on: successful fetch                        │
│                                                          │
│  lastUpdated: Date | null                               │
│  ├─ Updated on: successful fetch                        │
│  └─ Used for: display last sync time                    │
│                                                          │
│  isRunning: boolean                                      │
│  ├─ true: fetching is active                            │
│  └─ false: fetching is stopped                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Task Definition

```typescript
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // 1. Fetch new data
    const newMiners = await MinerService.fetchMiners();
    
    // 2. Get old data
    const oldMiners = await MinerService.getStoredMiners();
    
    // 3. Compare
    const { newItems, updatedItems, removedItems } = 
      MinerService.compareMiners(oldMiners, newMiners);
    
    // 4. Send notifications
    if (newItems.length > 0) {
      await MinerService.notifyNewMiners(newItems);
    }
    if (updatedItems.length > 0) {
      await MinerService.notifyUpdatedMiners(updatedItems);
    }
    if (removedItems.length > 0) {
      await MinerService.notifyRemovedMiners(removedItems);
    }
    
    // 5. Save to storage
    await MinerService.saveMiners(newMiners);
    
    // 6. Return result
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
```

---

## Timing Diagram

```
Timeline (Minutes)
│
├─ 0:00  ┬─ App Start
│        ├─ registerBackgroundFetch(900)
│        └─ startFetching() [10s interval]
│
├─ 0:10  ├─ Foreground fetch #1
├─ 0:20  ├─ Foreground fetch #2
├─ 0:30  ├─ Foreground fetch #3
├─ 0:40  ├─ Foreground fetch #4
├─ 0:50  ├─ Foreground fetch #5
│
├─ 1:00  ├─ Foreground fetch #6
│        └─ (Background fetch #1 if app in background)
│
├─ 2:00  ├─ Foreground fetch #12
│        └─ (Background fetch #2 if app in background)
│
├─15:00  ├─ Foreground fetch #90
│        └─ Background fetch #1 (even if app closed!)
│
├─30:00  ├─ Foreground fetch #180
│        └─ Background fetch #2 (even if app closed!)
│
└─...    └─ Continues...
```

---

## File Structure

```
noti/
├── app/
│   ├── _layout.tsx                    [NEW]
│   └── (tabs)/
│       └── index.tsx                  [MODIFIED]
│
├── services/
│   ├── backgroundFetchService.ts      [NEW]
│   └── minerService.ts                [EXISTING]
│
├── hooks/
│   └── useMinerFetcher.ts             [EXISTING]
│
├── components/
│   └── MinerList.tsx                  [EXISTING]
│
├── config/
│   └── minerConfig.ts                 [EXISTING]
│
├── app.json                           [MODIFIED]
│
├── QUICK_START.md                     [NEW]
├── BACKGROUND_FETCH_GUIDE.md          [NEW]
├── CHANGES_SUMMARY.md                 [NEW]
├── IMPLEMENTATION_SUMMARY.txt         [NEW]
└── ARCHITECTURE.md                    [NEW - This file]
```

---

## Key Points

1. **Dual Fetching**
   - Foreground: 10 seconds (UI responsive)
   - Background: 15 minutes (battery efficient)

2. **Persistent**
   - Continues when app is closed
   - Restarts on device reboot

3. **Notification-Driven**
   - Only notifies on data changes
   - Compares old vs new data

4. **Storage-Backed**
   - Saves data locally
   - Available when offline

5. **Non-Blocking**
   - Background task doesn't block UI
   - Foreground fetch independent of background

---

## Performance Considerations

| Metric | Value | Impact |
|--------|-------|--------|
| Foreground Interval | 10s | Quick updates, higher battery usage |
| Background Interval | 15min | Battery efficient, timely updates |
| API Calls/Hour | 4 (background) | Low server load |
| Notifications/Hour | 0-4 | Only on changes |
| Storage Usage | Minimal | Just miner data |
| Network Usage | ~1KB/call | Very low |

---

## Security & Permissions

```
Required Permissions:
├─ POST_NOTIFICATIONS (Android)
├─ NSUserNotificationUsageDescription (iOS)
└─ RECEIVE_BOOT_COMPLETED (Android - implicit)

Handled By:
├─ app.json (permissions declaration)
├─ Notifications.requestPermissionsAsync() (runtime)
└─ Expo plugins (native setup)
```

---

## Conclusion

Background fetch is now fully integrated into your app with:
- ✅ Automatic registration on app start
- ✅ Parallel foreground & background fetching
- ✅ Persistent across app lifecycle
- ✅ Notification-driven updates
- ✅ Local storage backup
- ✅ Device reboot resilience

