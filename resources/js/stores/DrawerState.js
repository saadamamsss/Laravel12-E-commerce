import { defineStore } from "pinia";
import { ref } from "vue";

export const useDrawerStore = defineStore("DRAWER", () => {
    // State
    const isOpen = ref(false);
    const drawerContent = ref(null);

    function toggleDrawer() {
        isOpen.value = !isOpen.value;
        if (isOpen.value)
            document.querySelector("body").classList.add("no-scroll");
        else document.querySelector("body").classList.remove("no-scroll");
    }

    function setDrawerContent(data) {
        drawerContent.value = data;
    }

    return {
        isOpen,
        toggleDrawer,
        drawerContent,
        setDrawerContent,
    };
});
