import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "prosemirror-image-plugin/dist/styles/common.css";
import "prosemirror-image-plugin/dist/styles/withResize.css";
import "prosemirror-image-plugin/dist/styles/sideResize.css";
import { lintDeco } from './lint'; //highlight function

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )
import { EditorState, Transaction } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from "prosemirror-model"
import { exampleSetup } from "prosemirror-example-setup"
import { mySchema,initialDoc } from "./schema"
import {CodeBlockView,arrowHandlers} from "./codemirror"
import { defaultSettings, updateImageNode, imagePlugin } from "prosemirror-image-plugin"


let editor = document.querySelector("#editor")!
let content = document.querySelector("#content")!
let view = new EditorView(editor, {
  state: EditorState.create({
    doc: mySchema.nodeFromJSON(initialDoc),
    plugins: [
      ...exampleSetup({ schema: mySchema }).concat(arrowHandlers),
      imagePlugin(mySchema, { ...defaultSettings }),
    ]
  }),
  nodeViews: {code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos)}
})


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

//new find 
export function newFind (doc: Node) {
  let find = document.querySelector('#find') as HTMLInputElement;
let nuevo = "";
document.getElementById('go2')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  if(s.includes(find.value)){
    nuevo = find.value
    nuevo = nuevo.bold() // bold
    //nuevo = nuevo.toUpperCase() //sets found word to upper case 
    
  }
  content.innerHTML = s.replaceAll(find.value, nuevo)
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})
}


  