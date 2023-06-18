<script lang=ts>
  import Button from '@smui/button';

  export let files: FileList | undefined;
  export let accept: string

	let fileInputHTMLElement: HTMLElement;
  let filename = "未選択"

  function prunedRestProps(): any {
    delete $$restProps.class;
    return $$restProps;
  }

  function onChange(): void {

    const fetchedFilename = files?.item(0)?.name
    if (fetchedFilename === undefined) {
    return 
    }

    filename =  fetchedFilename
  }


  function onButtonClick(): void {
    fileInputHTMLElement.click()
  }
</script>
<div class="flex items-center space-x-4">
  <Button variant="outlined" on:click={onButtonClick}>ファイルを選択</Button>
  <p>{filename}</p>
</div>
<input
  type="file"
  accept="{accept}"
  class="hidden"
  bind:this={fileInputHTMLElement}
  bind:files
  {...prunedRestProps()}
  on:change
  on:change={onChange}
>