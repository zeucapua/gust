<script lang="ts">
  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";
  import localizedFormat from "dayjs/plugin/localizedFormat";
  import { onMount, onDestroy } from "svelte";

  dayjs.extend(duration);
  dayjs.extend(localizedFormat);

  export let start_time : number | null = null;
  let time_lapsed : number = 0;
  let is_running = false;
  let timer_interval : ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    if (start_time) {
      is_running = true;
    }
  });

  $: if (is_running) startTimer(start_time ?? Date.now()); else endTimer();

  function startTimer(time? : number) {
    // TODO: call HTMX JS API to toggle inputs ('runTimer' event)
    htmx.trigger("#timer_inputs", "runTimer", {});
    // TODO: start interval
  }

  function endTimer() {
    // TODO: call HTMX JS API to toggle inputs ('endTimer' event)
    htmx.trigger("#timer_inputs", "endTimer", {});
    // TODO: end interval
  }

</script>

<button on:click={() => is_running = !is_running}>
  { is_running ? "End" : "Start" }
</button>

<p class="border border-orange-500 px-2 py-1">
  {dayjs.duration(time_lapsed, "seconds").format('HH:mm:ss')}
</p>
