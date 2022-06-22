/* eslint-disable @typescript-eslint/no-explicit-any */
import { reactive } from 'vue'

export default reactive({
  HISTORY_KEEP_SECONDS: 20,
  MAX_MSG_LENGTH: 60,
  CMD_PREFIX_ONLY: false,
  NO_BAD_WORDS: true,
  LOWERCASE_ONLY: true,
  SINGLE_WORDS_ONLY: true,
})
