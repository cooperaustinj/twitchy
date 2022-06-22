<template>
  <q-page class="row items-center justify-center">
    <div class="col-10 q-pa-xl" id="message-box">
      <div
        v-for="s in messageStats"
        :key="s.msg"
        class="row q-gutter-md q-my-md text-h4 text-weight-bold"
        style="width: 100%"
      >
        <div class="col text-right">{{ s.count }}</div>
        <div class="col-10">{{ s.msg }}</div>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss"></style>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import TwitchJs, { Messages } from 'twitch-js'
import Filter from 'bad-words'
import settings from 'src/store/settings'

const bwFilter = new Filter()

function toSeconds(ms: number) {
  return Math.floor(ms / 1000)
}

type HistoricalMessage = { time: number; msg: string }
type MessageStat = { msg: string; count: number }

export default defineComponent({
  setup() {
    const route = useRoute()
    const chat = new TwitchJs.Chat({
      username: undefined,
      token: undefined,
      log: { level: 'error' },
    })
    const chatLog = ref('')
    const channelName = route.params.channel as string
    const messageHistory = ref<HistoricalMessage[]>([])
    const messageStats = ref<MessageStat[]>([])

    const mainLoop = window.setInterval(calcChatStats, 200)

    function processMessage(message: Messages & { message?: string }) {
      const time = toSeconds(new Date(message.timestamp).getTime())
      const event = message.event

      if (event !== 'PRIVMSG') return
      if (settings.CMD_PREFIX_ONLY && !message.message.startsWith('!s ')) return
      const msg = message.message.slice((settings.CMD_PREFIX_ONLY && 3) || 0)

      if (msg.length > settings.MAX_MSG_LENGTH) return

      if (settings.NO_BAD_WORDS && bwFilter.isProfane(msg)) return

      messageHistory.value.push({
        time,
        msg: (settings.LOWERCASE_ONLY && msg.toLowerCase()) || msg,
      })

      while (
        messageHistory.value[0].time <
        toSeconds(new Date().getTime()) - settings.HISTORY_KEEP_SECONDS
      ) {
        messageHistory.value.shift()
      }
    }

    function calcChatStats() {
      const newStats: Record<string, number> = {}
      for (let hm of messageHistory.value) {
        const cc = newStats[hm.msg] || 0
        newStats[hm.msg] = cc + 1
      }
      const sortedTop10 = Object.entries(newStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)

      messageStats.value = sortedTop10.map((s) => ({ msg: s[0], count: s[1] }))
    }

    onMounted(async () => {
      chat.on('*', processMessage)

      await chat.connect()
      await chat.join(channelName)
    })

    onUnmounted(() => {
      window.clearInterval(mainLoop)
    })

    return {
      channelName,
      chatLog,
      messageHistory,
      messageStats,
    }
  },
})
</script>
