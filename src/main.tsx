import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"


// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
});
let editor = document.querySelector("#editor")!
let content = document.querySelector("#content")!
let view = new EditorView(editor, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  })
})
//Replace
let search = document.querySelector('#search') as HTMLInputElement;
let replace = document.querySelector('#replace') as HTMLInputElement;
document.getElementById('go')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  content.innerHTML = s.replaceAll(search.value, replace.value)
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})

//Find and highlight function 
/*
let find = document.querySelector("#find") as HTMLInputElement;
document.getElementById('go2')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  if (s.includes(find.value)){
    content.innerHTML = find.value //+ add highlight 
  }
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})
*/

//new find to test
let find = document.querySelector('#find') as HTMLInputElement;
let nuevo = "";
document.getElementById('go2')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  if(s.includes(find.value)){
    nuevo = find.value
    //nuevo = nuevo.bold() // bold
    nuevo = nuevo.toUpperCase() //sets found word to upper case 
  }
  content.innerHTML = s.replaceAll(find.value, nuevo)
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})
 
//prosemirror linting
//import {Decoration, DecorationSet} from "prosemirror-view"

// function lintDeco(document) {
//   let decorations = []
//   lint(document).forEach(prob => {
//     decorations.push(Decoration.inline(prob.from, prob.to, {class: "problem"}),
//                Decoration.widget(prob.from, lintIcon(prob)))
//   })
//   return DecorationSet.create(document, decorations)
// }

