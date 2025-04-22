<template>
    <li class="relative px-2">
        <button @click="toggleDropdown" class="relative">
            <i class="fa-solid fa-bell"></i>
            <span v-if="totalUnreadCount > 0"
                class="absolute top-0 -right-1 bg-red-500/90 text-white rounded-full w-2 h-2 flex items-center justify-center text-xs">
            </span>
        </button>

        <!-- Dropdown -->
        <div v-if="showDropdown"
            class="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
            <div class="px-4 py-2 border-b bg-gray-50 flex justify-between items-center">
                <h3 class="font-medium">Notifications</h3>
                <button @click="markAllAsRead" class="text-xs text-blue-600 hover:text-blue-800">
                    Mark all as read
                </button>
            </div>

            <div class="max-h-96 overflow-y-auto">
                <div v-if="groupedNotifications.length === 0" class="p-4 text-center text-gray-500">
                    No new notifications
                </div>

                <div v-for="group in groupedNotifications" :key="`${group.type}-${group.id}`"
                    @click="handleGroupClick(group)"
                    class="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-50': group.unreadCount > 0 }">
                    <div class="px-4 py-3">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-medium text-sm" :class="{ 'text-blue-600': group.unreadCount > 0 }">
                                    {{ group.title }}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">
                                    {{ formatTime(group.latestDate) }}
                                </p>
                            </div>
                            <span v-if="group.count > 1"
                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ group.count }}
                            </span>
                        </div>
                        <div class="mt-2">
                            <p class="text-xs text-gray-600 truncate">
                                {{ group.latestMessage }}
                            </p>
                        </div>
                        <div class="mt-1">
                            <span class="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-600">
                                {{ formatNotifiableType(group.type) }}
                            </span>
                            <span v-if="group.unreadCount > 0"
                                class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {{ group.unreadCount }} unread
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Link href="#"
                class="block px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 border-t">
            View all notifications
            </Link>
        </div>
    </li>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Link, usePage, router } from '@inertiajs/vue3';
import { API } from "@/utils/api.js";

const { props: pageProps } = usePage();
const props = defineProps({
    initialNotifications: {
        type: Array,
        default: () => []
    },
    unreadCount: {
        type: Number,
        default: 0
    }
});

const showDropdown = ref(false);
const notifications = ref(props.initialNotifications);

// Group notifications by notifiable_type and notifiable_id
const groupedNotifications = computed(() => {
    const groups = {};

    notifications.value.forEach(notification => {
        const key = `${notification.data.notifiable_type}-${notification.data.notifiable_id}`;

        if (!groups[key]) {
            groups[key] = {
                type: notification.data.notifiable_type,
                id: notification.data.notifiable_id,
                count: 0,
                unreadCount: 0,
                latestDate: null,
                latestMessage: '',
                title: '',
                url: notification.data.url,
                primaryIds: []
            };
        }

        // Update group with latest notification
        if (!groups[key].latestDate || new Date(notification.created_at) > new Date(groups[key].latestDate)) {
            groups[key].latestDate = notification.created_at;
            groups[key].latestMessage = notification.data.message;
            groups[key].title = getGroupTitle(notification);
            groups[key].url = notification.data.url; // Use URL from latest notification
        }

        groups[key].count++;
        groups[key].primaryIds.push(notification.id);
        if (!notification.read_at) {
            groups[key].unreadCount++;
        }
    });

    return Object.values(groups).sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate));
});

const totalUnreadCount = computed(() => {
    return groupedNotifications.value.reduce((sum, group) => sum + group.unreadCount, 0);
});

const getGroupTitle = (notification) => {
    const type = notification.data.notifiable_type;
    const id = notification.data.notifiable_id;

    switch (type) {
        case 'Contact':
            return `Contact Message #${id}`;
        default:
            return `${type} #${id}`;
    }
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatNotifiableType = (type) => {
    const types = {
        'Order': 'Order',
        'Review': 'Review',
        'Contact': 'Contact'
    };
    return types[type] || type;
};

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const handleGroupClick = async (group) => {
    // Navigate to the group URL
    if (group.url) {
        router.visit(group.url);
    }

    showDropdown.value = false;
    // Mark all in group as read if any are unread
    if (group.unreadCount > 0) {
        try {
            const { data } = await API.post('notifications-read-group', { ids: group.primaryIds });

            if (data.success) {
                // Update local state
                notifications.value = notifications.value.map(n => {
                    if (n.data.notifiable_type === group.type && n.data.notifiable_id === group.id) {
                        return { ...n, read: new Date() };
                    }
                    return n;
                });
            }

        } catch (error) {

            console.log("faild");

        }
    }

};

const markAllAsRead = async () => {
    try {
        const { data } = await API.post('notifications-read-all', {});
        if (data.success) {
            notifications.value = notifications.value.map(n => ({ ...n, read: true }));
        }
    } catch (error) {

        console.log("faild");
    }
};

// Close dropdown when clicking outside
const clickOutside = (event) => {
    if (!event.target.closest('.relative')) {
        showDropdown.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', clickOutside);


    if (pageProps.auth.user) {
        const chanelName = `user.${pageProps.auth.user.id}-channel`;
        window.Echo.private('user.' + pageProps.auth.user.id)
            .notification((notification) => {
                notifications.value.unshift(notification);
            });


    }

});

onUnmounted(() => {
    document.removeEventListener('click', clickOutside);
});
</script>