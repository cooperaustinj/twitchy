<template>
  <q-layout view="hhh lpR fff">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title> Twitchy.chat </q-toolbar-title>
        <q-space />
        <q-btn dense flat round icon="settings" @click="toggleLeftDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="right" overlay bordered>
      <!-- drawer content -->
      <div class="q-pa-lg">
        <q-toggle
          v-model="settings.NO_BAD_WORDS"
          label="No bad words (basic)"
        />
        <q-toggle v-model="settings.CMD_PREFIX_ONLY" label="Prefix only (!s)" />
        <q-toggle v-model="settings.LOWERCASE_ONLY" label="Case insensitive" />
        <q-toggle
          v-model="settings.SINGLE_WORDS_ONLY"
          label="Single words only"
        />
        <q-input
          v-model.number="settings.HISTORY_KEEP_SECONDS"
          label="History Duration (seconds)"
          type="number"
          lazy-rules
          :rules="durationRules"
        />
        <q-input
          v-model.number="settings.MAX_MSG_LENGTH"
          label="Max message length"
          type="number"
          lazy-rules
          :rules="lengthRules"
        />
        <div>
          Use a Luma Key filter on the browser source for a transparent
          background.
          <ul>
            <li>Luma Max: 1.0000</li>
            <li>Luma Max Smooth: 0.0000</li>
            <li>Luma Min: 0.5000</li>
            <li>Luma Min Smooth: 0.0000</li>
          </ul>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import settings from 'src/store/settings'

export default {
  setup() {
    const leftDrawerOpen = ref(true)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      settings,
      durationRules: [
        (val) => (val >= 1 && val <= 60) || 'Must be 1 <= x <= 60',
      ],
      lengthRules: [
        (val) => (val >= 1 && val <= 120) || 'Must be 1 <= x <= 120',
      ],
    }
  },
}
</script>
