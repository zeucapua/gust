<script lang="ts">
  import dayjs from "dayjs";
  import duration from "dayjs/plugin/duration";
  import localizedFormat from "dayjs/plugin/localizedFormat";
  import { onMount, onDestroy } from "svelte";

  dayjs.extend(duration);
  dayjs.extend(localizedFormat);

  export let start_time = Date.now();
  let time_lapsed : number = 0;
  let timer_interval : ReturnType<typeof setInterval>;

  onMount(() => {
    timer_interval = setInterval(() => {
      time_lapsed = Math.floor((Date.now() - start_time) / 1000);
    }, 1000);
  });

  onDestroy(() => { 
    clearInterval(timer_interval); 
  });
</script>

<p class="border border-orange-500 px-2 py-1">
  {dayjs.duration(time_lapsed, "seconds").format('HH:mm:ss')}
</p>
