<script lang="ts">
  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";
  import localizedFormat from "dayjs/plugin/localizedFormat";
  import { onMount } from "svelte";

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
  $: console.log(time_lapsed);

  function startTimer(time : number) {
    htmx.trigger("#timer_inputs", "runTimer", {});
    time_lapsed = Math.floor((Date.now() - time) / 1000);
    timer_interval = setInterval(() => {
      time_lapsed += 1;
    }, 1000)
  }

  function endTimer() {
    htmx.trigger("#timer_inputs", "endTimer", {});
    start_time = null;
    time_lapsed = 0;
    if (timer_interval) clearInterval(timer_interval);
  }

</script>

<div class="flex gap-4 items-center">
  <button 
    on:click={() => is_running = !is_running}
    class="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 font-medium text-black border transition active:scale-95"
  >
    { is_running ? "End" : "Start" }
  </button>

  <p>
    {dayjs.duration(time_lapsed, "seconds").format('HH:mm:ss')}
  </p>
</div>
