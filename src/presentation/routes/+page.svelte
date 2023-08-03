
<script lang="ts">
	// TODO: ローディング切り替えができない
	// TODO: ローディング中に、進捗を表示したい
	// TODO: 説明文の追加
	// TODO: GitHub アイコンとリンクの表示 
	
	// svelte
	import { enhance } from '$app/forms';

	// smui
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import IconButton from '@smui/icon-button';
	import { Icon, Label } from '@smui/common';
	import Snackbar from '@smui/snackbar';
	import Tooltip, { Wrapper, Title, Content, Link } from '@smui/tooltip';
	import LinearProgress from '@smui/linear-progress';
	// app component
	import FileInput  from "../components/FileInput.svelte"

	// app utils
	import { GameHintCsv } from '../../domain/entities/game_hint/GameHintCsv'
	import { FormState } from '../../utils/FormState'

	export let form;

	// TODO: action したら、なんか bind してた値がリセットされる
	const formStates = {
		challongeApiKey:  new FormState(''),
		tournamentName: new FormState(''),
		csvFile: new FormState<FileList>(undefined)
	}
	let participantNames: string | undefined

	let gameHintCsv: GameHintCsv | undefined;

	// ui
	let errorSnackBar: Snackbar;
	let isLoading: boolean = false

	async function paste(): Promise<void> {
		const text = await  navigator.clipboard.readText();

		if (text) {
			formStates.challongeApiKey.value = text;
		}
	}

	async function onFileSelected() {
		const file = formStates.csvFile.value?.item(0);

		if (!file) {
			return;
		}

		formStates.tournamentName.value = file.name.split('.')[0];
		gameHintCsv = await GameHintCsv.fromFile(file);
		participantNames = JSON.stringify(gameHintCsv.list.map((e) => e.名前))
	}

	async function beforeSaved() {
		const a = document.createElement('a');
		a.href = "#";
		a.click();
		isLoading = true;
	}

	async function onSaved() {

		// onError
		await new Promise((r) => setTimeout(r, 100));

		if (form?.error !== undefined) {
			errorSnackBar.open();
		}

		isLoading = false;

		// onSuccess
	}
</script>

<Snackbar bind:this={errorSnackBar}>
	<Label>{form?.error}</Label>
</Snackbar>

<div class="mx-6 sm:mx-16 mt-10 mb-20 space-y-12">
	<div class="flex space-x-6 justify-between">
		<h2 class="mdc-typography--headline2">GameHint to Challonge</h2>
		<!-- TODO: GitHub アイコンとリンクの表示  -->
		<div class="flex scale-120">
			<a href="https://twitter.com/zudah1321" class="flex-col flex items-center">
				<IconButton>{String.fromCodePoint(0x1d54f)}</IconButton>
			</a>
			<a href="https://github.com/Zudah228/gamehint_to_csv_web">
				<IconButton>
					<img src="images/github-mark-white.png" alt="github">
				</IconButton>
			</a>
		</div>
	</div>

	<p class="text-white opacity-60">
		<Link href="https://www.gamehint.app/" class="text-primary">
			GameHint
		</Link>
		の参加者 CSV ファイルから、自動で
		<Link href="https://challonge.com" class="text-primary">
			Challonge
		</Link>
		のトーナメントに登録します。<br/>ダブルエリミネーション方式 に自動で設定されます。
	</p>
	


	{#if isLoading}
	<div class="space-y-3">
		<LinearProgress class="my-colored-linear-progress" indeterminate />
		<p class="text-primary">送信なう</p>
	</div>
	{/if}

	{#if form?.url !== undefined}
		<div class="bg-green-200 text-green-800 space-y-2 rounded-md py-4 px-6">
			<div class="flex items-center space-x-2">
				<Icon class="material-icons">info</Icon>
				<p class="mdc-typography--overline text-base font-bold">トーナメントの作成が完了しました！</p>
			</div>
			
			<div>
				<Link href="{form?.url}">
					<p class="underline">{form?.url}</p>
				</Link>
			</div>
		</div>
	{/if}
	<!-- ファイル選択 -->
	<div class="space-y-4">
		<h5 class="mdc-typography--headline5">1. GameHint の参加者 CSV</h5>
		<div class="ml-4 space-y-1">
			<p class="opacity-60">GameHint の管理者ページからダウンロードした CSV を選択してください。</p>

			<details>
			<summary class="opacity-60">スクリーンショット</summary>
			<img width="480" src="images/game-hint-csv-tutorial.png" alt="game-hint-csv-tutorial">
			</details>
			
		</div>
		<div class="space-y-2">
			<FileInput accept="text/csv" bind:files={formStates.csvFile.value} on:change={onFileSelected} />
			{#if formStates.csvFile.error}
				<caption class="flex text-rose-400">{formStates.csvFile.error}</caption>
			{/if}
		</div>
		

		{#if gameHintCsv}
			<div class="py-2 px-4 bg-slate-900 inline-flex">
				<caption class="flex">
						参加者：
						{#each gameHintCsv.list as participant, i}
							{#if i <= 4}
								{participant.名前}, 
							{/if}
							{#if i === 5}
								... 
							{/if}
						{/each}
				</caption>
			</div>
		{/if}
	</div>

	<!-- Challonge APIキー -->
	<div class="space-y-2">
		<div class="flex items-center space-x-4">
			<h5 class="mdc-typography--headline5">2. Challonge API キー</h5>
			<Wrapper rich class="flex items-center">
				<Icon class="material-icons cursor-pointer">help</Icon>

				<Tooltip interactive yPos="above" xPos="end">
					<Title>
						API キーとは
					</Title>
					<Content>
						Challonge の開発者ページで取得できます
						<br/>
						<Link
							href="https://challonge.com/settings/developer"
							target="_blank">https://challonge.com/settings/developer</Link
						>
					</Content>
				</Tooltip>
			</Wrapper>
		</div>
		<div class="space-y-2">
			<Textfield class="flex items-center" type="text" variant="filled" bind:value={formStates.challongeApiKey.value}>
				<div slot="trailingIcon">
					<Wrapper rich class="z-50" >
						<IconButton class="material-icons"  on:click={paste}>content_paste</IconButton>
						<Tooltip  interactive yPos="above" xPos="center">
							<p>Paste!</p>
						</Tooltip>
					</Wrapper>
				</div>
			</Textfield>
			{#if formStates.challongeApiKey.error}
				<caption class="flex text-rose-400">{formStates.challongeApiKey.error}</caption>
			{/if}
		</div>
	</div>

	<!-- トーナメントの名前 -->
	<div class="space-y-2">
		<h5 class="mdc-typography--headline5">3. トーナメントの名前</h5>
		<p class="flex mdc-typography--overline">※ CSV を選択したら、自動入力されます。</p>

		<div class="space-y-2">
			<Textfield type="text" variant="filled" class="flex items-center" placeholder="自動入力されます" bind:value={formStates.tournamentName.value} style="max-width: 840;">
				<HelperText slot="helper">Challonge に登録されるトーナメントの名前</HelperText>
			</Textfield>
			{#if formStates.tournamentName.error}
				<caption class="flex text-rose-400">{formStates.tournamentName.error}</caption>
			{/if}
		</div>
	</div>
	<div>
		<form method="POST" action="?/tournament" use:enhance={() => {
			beforeSaved();
			return async ({ update,  }) => {

				await update();

				onSaved();
			}
		}}>
			<div class="hidden">
				<input bind:value={formStates.challongeApiKey.value} name="challongeApiKey">
				<input bind:value={formStates.tournamentName.value} name="tournamentName">
				<input bind:value={participantNames} name="participantNames">
			</div>
			<Button type="submit" variant="raised">送信</Button>
		</form>
	</div>
</div>