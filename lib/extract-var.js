'use babel'

import { CompositeDisposable } from 'atom'
import { config } from './config'

export default {
	config,
	subscriptions: null,
	useSemicolon: config.semicolons.default,

	activate(state) {
		this.subscriptions = new CompositeDisposable()
		atom.config.observe(
			'extract-var.semicolons',
			value => (this.useSemicolon = value)
		)

		this.subscriptions.add(
			atom.commands.add(
				'atom-text-editor',
				'extract-var:const',
				this.const.bind(this)
			)
		)
		this.subscriptions.add(
			atom.commands.add(
				'atom-text-editor',
				'extract-var:let',
				this.let.bind(this)
			)
		)
		this.subscriptions.add(
			atom.commands.add(
				'atom-text-editor',
				'extract-var:var',
				this.var.bind(this)
			)
		)
	},

	extract(definer) {
		const editor = atom.workspace.getActiveTextEditor()
		const checkpoint = editor.createCheckpoint()
		const selectedText = editor.getSelectedText()
		const semicolon = this.useSemicolon ? ';' : ''
		editor.insertText(`extractedConst`)
		editor.insertNewlineAbove()
		editor.insertText(`${definer} extractedConst = ${selectedText}${semicolon}`)
		editor.moveToBeginningOfLine()
		editor.moveToBeginningOfNextWord()
		editor.moveToBeginningOfNextWord()
		editor.selectToEndOfWord()
		const editorView = atom.views.getView(editor)
		atom.commands.dispatch(editorView, 'find-and-replace:select-next')
		editor.groupChangesSinceCheckpoint(checkpoint)
	},

	var() {
		this.extract('var')
	},

	let() {
		this.extract('let')
	},

	const() {
		this.extract('const')
	},

	deactivate() {
		this.subscriptions.dispose()
	},

	serialize() {
		return {}
	}
}
