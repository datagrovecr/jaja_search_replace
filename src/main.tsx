import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "prosemirror-image-plugin/dist/styles/common.css";
import "prosemirror-image-plugin/dist/styles/withResize.css";
import "prosemirror-image-plugin/dist/styles/sideResize.css";


import {dinoMenu, dinoSchema} from "./dinosExample"
// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )
import { EditorState, Transaction } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser, Schema } from "prosemirror-model"
import { exampleSetup } from "prosemirror-example-setup"
import {initialDoc } from "./schema"
//import {CodeBlockView,arrowHandlers} from "./codemirror"
import { defaultSettings, updateImageNode, imagePlugin } from "prosemirror-image-plugin"
import { lintPlugin } from './lint';

const sch = dinoSchema
const doc =  {
  type: "doc",
  content: [
    {
      content: [
        {
          text: "Start typing!",
          type: "text",
        },
      ],
      type: "paragraph",
    },
  ]
}


let editor = document.querySelector("#editor")!
let content = document.querySelector("#content")!
let view = new EditorView(editor, {
  state: EditorState.create({
    doc: sch.nodeFromJSON(doc),
    plugins: [
      ...exampleSetup({ 
        schema: sch,
        menuContent: dinoMenu
       }),
      imagePlugin(sch, { ...defaultSettings }),
      lintPlugin,
      //searchReplacePlugin2
    ]
  }),
 // nodeViews: {code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos)}
})


let search = document.querySelector('#search') as HTMLInputElement;
let replace = document.querySelector('#replace') as HTMLInputElement;

/*
document.getElementById('go')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  content.innerHTML = s.replaceAll(search.value, replace.value)
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})
*/
/*
document.getElementById('search')?.addEventListener('change', () => {
  return function (state: EditorState, dispatch){
    let {$from} = state.selection, index = $from.index()
    dispatch(state.tr.replaceSelectionWith(view.doc.create()))
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
    doc: DOMParser.fromSchema(dinoSchema).parse(content),
    plugins: exampleSetup({schema: dinoSchema})
  }))
})
}


  