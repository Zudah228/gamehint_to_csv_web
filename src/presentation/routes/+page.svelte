<script lang="ts">
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import IconButton from '@smui/icon-button';
	import { Icon, Label } from '@smui/common';
	import Snackbar from '@smui/snackbar';
	import Tooltip, { Wrapper, Title, Content, Link } from '@smui/tooltip';
	import FileInput  from "../components/FileInput.svelte"

	import { GameHintCsv } from '../../domain/entities/game_hint/GameHintCsv'
	import { getNewCreateTournament } from '../../application/CreateTournament'
	import { FormState } from '../../utils/FormState'
    import { AppError } from '../../domain/exception/AppError'

	const formStates = {
		challongeApiKey:  new FormState(''),
		tournamentName: new FormState(''),
		csvFile: new FormState<FileList>(undefined)
	}
	let gameHintCsv: GameHintCsv | undefined;
	let loadingMessage: string | undefined;
	let snackbarLoading: Snackbar;
	let resultUrl: string | undefined;

	async function paste(): Promise<void> {
		const text = await  navigator.clipboard.readText()

		if (text) {
			formStates.challongeApiKey.value = text
		}
	}

	async function onFileSelected() {
		const file = formStates.csvFile.value?.item(0);

		if (!file) {
			return;
		}

		formStates.tournamentName.value = file.name.split('.')[0];
		gameHintCsv = await GameHintCsv.fromFile(file);
	}

	function validate(): boolean {
		let isValid = true;
		if (!formStates.csvFile.value) {
			formStates.csvFile.error = "ファイルを選択してください";
			isValid = false;
		} else {
			formStates.csvFile.error = undefined;
		}

		if (!formStates.challongeApiKey.value) {
			formStates.challongeApiKey.error = "ChallongeAPIキーを入力してください";
			isValid = false;
		} else {
			formStates.challongeApiKey.error = undefined;
		}

		if (!formStates.tournamentName.value) {
			formStates.tournamentName.error = "トーナメントの名前";
			isValid = false;
		} else {
			formStates.tournamentName.error = undefined;
		}

		return isValid;
	}

	async function onSubmitted() {
		try {
			if (!validate()) {
				return;
			}
			
			const challongeApiKey = formStates.challongeApiKey.value!.trim();
			const tournamentName = formStates.tournamentName.value!.trim();
			const participantNames = gameHintCsv!.list.map((e) => e.名前)

			const createTournament = getNewCreateTournament(challongeApiKey)

			const url = await createTournament.call({
				tournamentName,
				participantNames,
				onMessageChanged: (message) => {
					loadingMessage = message;

					snackbarLoading.open();
				}
			});

			resultUrl = url;
		} catch (e) {
			if (e instanceof AppError) {
				alert(e.message)
			}
		}
	}

</script>

<Snackbar bind:this={snackbarLoading}>
	<Label>{loadingMessage}</Label>
</Snackbar>

<div class="mx-16 mt-8 space-y-12">
	<h2 class="mdc-typography--headline2">GameHint to Challonge</h2>

	{#if resultUrl !== undefined}
		<div class="bg-green-200 text-green-800 space-y-2 rounded-md py-4 px-6">
			<div class="flex items-center space-x-2">
				<Icon class="material-icons">info</Icon>
				<p class="mdc-typography--overline text-base font-bold">トーナメントの作成が完了しました！</p>
			</div>
			
			<div>
				<Link href="https://challonge.com/settings/developer">
					<p>{resultUrl}</p>
				</Link>
			</div>
		</div>
	{/if}
	<!-- ファイル選択 -->
	<div class="space-y-4">
		<h5 class="mdc-typography--headline5">GameHint の参加者 CSV</h5>
		<div class="space-y-2">
			<FileInput accept="text/csv" bind:files={formStates.csvFile.value} on:change={onFileSelected} />
			{#if formStates.csvFile.error}
				<caption class="flex text-rose-400">{formStates.csvFile.error}</caption>
			{/if}
		</div>
		

		{#if gameHintCsv}
			<div class="py-2 px-4 flex bg-slate-900">
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
			<h5 class="mdc-typography--headline5">Challonge API キー</h5>
			<Wrapper rich class="flex items-center">
				<Icon class="material-icons">help</Icon>

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
			<Textfield class="flex items-center" type="text" variant="filled" bind:value={formStates.challongeApiKey.value} style="min-width: 400px;">
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
		<h5 class="mdc-typography--headline5">トーナメントの名前</h5>
		<p class="flex mdc-typography--overline">※ CSV を選択したら、自動入力されます。</p>

		<div class="space-y-2">
			<Textfield type="text" variant="filled" class="flex items-center" placeholder="自動入力されます" bind:value={formStates.tournamentName.value} style="min-width: 400px;">
				<HelperText slot="helper">Challonge に登録されるトーナメントの名前</HelperText>
			</Textfield>
			{#if formStates.tournamentName.error}
				<caption class="flex text-rose-400">{formStates.tournamentName.error}</caption>
			{/if}
		</div>
	</div>
	<div>
		<Button type="submit" variant="raised" on:click={onSubmitted}>送信</Button>
	</div>
</div>
