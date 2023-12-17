<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let start_time = Date.now();
  let duration : number = 0;
  let timer_interval : ReturnType<typeof setInterval>;

  onMount(() => {
    timer_interval = setInterval(() => {
      duration = Math.floor((Date.now() - start_time) / 1000);
    }, 1000);
  });

  onDestroy(() => { clearInterval(timer_interval); });
</script>

<p class="border border-orange-500 px-2 py-1">{duration} seconds</p>
